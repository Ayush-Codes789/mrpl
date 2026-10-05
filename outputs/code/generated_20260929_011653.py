import numpy as np
from sklearn.svm import SVC, LinearSVC

def svm_mathematics():
    # 1. Dual optimization problem for SVM with kernel function K(x_i, x_j) = x_i · x_j + bias
    # Objective: minimize (1/2)||w||^2 + C * \sum_{i=1}^{n} \xi_i subject to y_i*(w\cdotx_i + b) >= 1 - \xi_i, \xi_i >= 0
    
    # Lagrangian formulation:
    # L(w,b,u) = (1/2)||w||^2 + C \sum_{i=1}^{n} u_i - \sum_{i=1}^{n} u_i*(y_i*(w\cdotx_i+b)-1)
    # Dual problem: maximize 0.5*\sum_{i,j}alpha_i alpha_j y_i y_j K(x_i,x_j) - \sum_i alpha_i subject to \sum_i alpha_i y_i = 0, 0<=alpha_i<=C
    
    # Simple example using linear kernel:
    X = np.array([[1,2],[2,3],[3,4]])
    y = np.array([-1,-1,1])
    model = LinearSVC()  # uses dual optimization internally
    model.fit(X, y)
    print('Coefficients (w):', model.coef_)
    print('Intercepts (b):', model.intercept_)
    
    # Quadratic kernel example:
    def rbf_kernel(x1, x2, gamma=0.5):
        return np.exp(-gamma * np.linalg.norm(x1 - x2)**2)

    X_rbf = np.column_stack([np.ones(X.shape[0]), X[:,0]])  # add bias term for feature mapping
    from sklearn import datasets
    iris = datasets.load_iris()
    X = iris.data
    y = (iris.target == 0).astype(int)  # binary classification example
    
    model_rbf = SVC(kernel='rbf', gamma=gamma)
    model_rbf.fit(X, y)
    print('RBF SVM coefficients:', model_rbf.coef_)
    print('RBF SVM intercepts:', model_rbf.intercept_)

    # Return the function so it can be executed elsewhere if needed.
    return svm_mathematics