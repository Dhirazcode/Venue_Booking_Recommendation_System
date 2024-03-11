from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from scipy.sparse import csr_matrix
from pandas.api.types import CategoricalDtype
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173", "supports_credentials": True}})
app.config["MONGO_URI"] = "mongodb://localhost:27017/test_db" 
mongo = PyMongo(app)

def recommend_venue(UID, num):
    try:
        # Get data from MongoDB
        venue_collection = mongo.db.venues
        review_collection = mongo.db.reviews
        venue = pd.DataFrame(list(venue_collection.find()))
        review = pd.DataFrame(list(review_collection.find()))
    except ValueError as e:
        print("Error reading JSON file:", e)
        return []

    venue = venue[['venue_id','name']]
    user_u = list(sorted(review.user_id.unique()))
    venue_u = list(sorted(review.venue_id.unique()))

    cat_type_user = CategoricalDtype(categories=user_u, ordered=True)
    cat_type_venue = CategoricalDtype(categories=venue_u, ordered=True)

    row = review.user_id.astype(cat_type_user).cat.codes
    col = review.venue_id.astype(cat_type_venue).cat.codes

    data = review['stars'].tolist()

    sparse_matrix = csr_matrix((data, (row, col)), shape=(len(user_u), len(venue_u)))
    ratings = pd.DataFrame.sparse.from_spmatrix(sparse_matrix,index=user_u, columns=venue_u)
    ratings.fillna(0, inplace = True)

    def matrix_factorization(R, P, Q, K, steps=10, alpha=0.0002, beta=0.02):
        for step in range(steps):
            for i in range(R.shape[0]):
                for j in range(R.shape[1]):
                    if R[i][j] > 0: # Skipping over missing ratings
                        #Calculating error
                        eij = R[i][j] - np.dot(P[i,:],Q[:,j])
                        for k in range(K):
                            # calculate gradient with alpha and beta parameter
                            P[i][k] = P[i][k] + alpha * (2 * eij * Q[k][j] - beta * P[i][k])
                            Q[k][j] = Q[k][j] + alpha * (2 * eij * P[i][k] - beta * Q[k][j])
            eR = np.dot(P,Q)
            e = 0
            for i in range(R.shape[0]):
                for j in range(R.shape[1]):
                    if R[i][j] > 0:
                        e = e + pow(R[i][j] - np.dot(P[i,:],Q[:,j]), 2)
                        for k in range(K):
                            e = e + (beta/2) * ( pow(P[i][k],2) + pow(Q[k][j],2) )
            if e < 0.001: # tolerance
                break
        return P, Q

    np.random.seed(862)

    # Initializations
    M = ratings.shape[0] # Number of users
    N = ratings.shape[1] # Number of items
    K = 3 # Number of latent features

    # Initial estimate of P and Q
    P = np.random.rand(M,K)
    Q = np.random.rand(K,N)
    rating_np = np.array(ratings)

    P, Q = matrix_factorization(rating_np, P, Q, K)

    predicted_rating = np.matmul(P, Q)
    predicted_rating = pd.DataFrame(predicted_rating, index = ratings.index, columns = ratings.columns)

    # Obtain the missing ratings
    missing_ratings = predicted_rating.loc[UID][ratings.loc[UID,:]==0]

    # Attach it with indices
    missing_ratings = pd.Series(missing_ratings, index = ratings.columns[ratings.loc[UID,:] == 0] )

    # Sort the ratings
    missing_ratings.sort_values(ascending = False, inplace = True)

    # Recommendations
    mat_fact = []
    for i in range(num):
        rec_rest_id = missing_ratings.index[i]
        mat_fact.append(rec_rest_id)
    return mat_fact

@app.route('/api/get_venue_data/<userId>', methods=['GET'])
def get_venue_data(userId):
    recommended_venue_id = recommend_venue(userId,4)

    return jsonify(recommended_venue_id)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
