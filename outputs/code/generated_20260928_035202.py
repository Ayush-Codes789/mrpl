import numpy as np
from sklearn import svm, datasets

def train_and_predict(X_train, y_train, X_test):
    # Create and train the SVM classifier
    clf = svm.SVC(kernel='linear')
    clf.fit(X_train, y_train)
    # Predict on test data
    predictions = clf.predict(X_test)
    return predictions

# Example usage with iris dataset (for illustration only)
if __name__ == '__main__':
    X, y = datasets.load_iris(return_X_y=True)
    train_idx = np.random.choice(len(X), size=int(0.5*len(X)), replace=False)
    X_train, y_train = X[train_idx], y[train_idx]
    X_test,  y_test = X[~train_idx], y[~train_idx]
    preds = train_and_predict(X_train, y_train, X_test)
    print('Predictions:', preds)
