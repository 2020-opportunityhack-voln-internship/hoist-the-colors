import joblib
from keras.preprocessing.sequence import pad_sequences
from keras.models import load_model
from scoring.preprocess import preprocess

def model(text):
    tokenizer = joblib.load('scoring/Tokenizer.pkl')
    text_sequences = tokenizer.texts_to_sequences(text)
    text_data = pad_sequences(text_sequences, maxlen=400)
    model = load_model('scoring/RNN_Model.h5')
    text_predicts = model.predict(text_data, batch_size=256, verbose=1)
    return text_predicts[0]

def calculate_scores(text, scores):
    print(text)
    preprocessed_text = preprocess(text)
    predicted_score = model([preprocessed_text])
    scores["total"] += 1

    #calculate average of each category
    if scores["toxic"]:
        scores["toxic"] = scores.get("toxic") + predicted_score[0]
    else:
        scores["toxic"] = predicted_score[0]
    if scores["severe_toxic"]:
        scores["severe_toxic"] = scores.get("severe_toxic") + predicted_score[1]
    else:
        scores["severe_toxic"] = predicted_score[1]
    if scores["obscene"]:
        scores["obscene"] = scores.get("obscene") + predicted_score[2]
    else:
        scores["obscene"] = predicted_score[2]
    if scores["threat"]:
        scores["threat"] = scores.get("threat") + predicted_score[3]
    else:
        scores["threat"] = predicted_score[3]
    if scores["insult"]:
        scores["insult"] = scores.get("insult") + predicted_score[4]
    else:
        scores["insult"] = predicted_score[4]
    if scores["identity_hate"]:
        scores["identity_hate"] = scores.get("identity_hate") + predicted_score[5]
    else:
        scores["identity_hate"] = predicted_score[5]
    print(predicted_score)
    no_of_categories = 6
    if predicted_score[0] < 0.1:
        predicted_score[0] = 0
        no_of_categories -= 1
    if predicted_score[1] < 0.1:
        predicted_score[1] = 0
        no_of_categories -= 1
    if predicted_score[2] < 0.1:
        predicted_score[2] = 0
        no_of_categories -= 1
    if predicted_score[3] < 0.1:
        predicted_score[3] = 0
        no_of_categories -= 1
    if predicted_score[4] < 0.1:
        predicted_score[4] = 0
        no_of_categories -= 1
    if predicted_score[5] < 0.1:
        predicted_score[5] = 0
        no_of_categories -= 1

    #calculate risk score
    risk_score_sum = 0.1 * predicted_score[0] + 0.4 * predicted_score[1] + 0.1 * predicted_score[2] + 0.2 * predicted_score[3] + 0.1 * predicted_score[4] + 0.1 * predicted_score[5]
    risk_score = 0 if no_of_categories == 0 else risk_score_sum/no_of_categories
    if scores["risk_score"]:
        scores["risk_score"] = scores.get("risk_score") + risk_score
    else:
        scores["risk_score"] = risk_score
