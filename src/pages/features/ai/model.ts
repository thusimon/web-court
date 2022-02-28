import * as tf from '@tensorflow/tfjs';

export const PageClass = ['login', 'other'];

export interface TrainCallback {
  (msg: string, logs: tf.Logs[], complete: boolean): void;
};
/**
 * Train a `tf.Model` to recognize Iris flower type.
 *
 * @param xTrain Training feature data, a `tf.Tensor` of shape
 *   [numTrainExamples, 4]. The second dimension include the features
 *   petal length, petalwidth, sepal length and sepal width.
 * @param yTrain One-hot training labels, a `tf.Tensor` of shape
 *   [numTrainExamples, 3].
 * @param xTest Test feature data, a `tf.Tensor` of shape [numTestExamples, 4].
 * @param yTest One-hot test labels, a `tf.Tensor` of shape
 *   [numTestExamples, 3].
 * @returns The trained `tf.Model` instance.
 */
export const trainModel = async ([xTrain, yTrain, xTest, yTest]: tf.Tensor[], callback: TrainCallback) => {
  console.log('start training model');
  const epochs = 50;
  const learningRate = 0.01;
  // Define the topology of the model: two dense layers.
  const model = tf.sequential();

  const layer1 = tf.layers.dense({
    units: 50,
    activation: 'sigmoid',
    inputShape: [xTrain.shape[1]]
  });
  model.add(layer1);
  const layer2 = tf.layers.dense({
    units: 10,
    activation: 'sigmoid'
  });
  model.add(layer2);
  const layer3 = tf.layers.dense({
    units: 2,
    activation: 'sigmoid'
  });
  model.add(layer3);
  model.summary();

  const optimizer = tf.train.adam(learningRate);
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  
  const trainLogs: tf.Logs[] = [];
  const beginMs = performance.now();
  // Call `model.fit` to train the model.
  const history = await model.fit(xTrain, yTrain, {
    epochs: epochs,
    validationData: [xTest, yTest],
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        // Plot the loss and accuracy values at the end of every training epoch.
        const secPerEpoch = (performance.now() - beginMs) / (1000 * (epoch + 1));
        const accuracyLoss = `Train accuracy/loss: ${logs.acc.toFixed(4)}/${logs.loss.toFixed(4)}; Test accuracy/loss: ${logs.val_acc.toFixed(4)}/${logs.val_loss.toFixed(4)}`;
        const message = `Training model... Approximately ${secPerEpoch.toFixed(4)} seconds per epoch
  ${accuracyLoss}`;
        trainLogs.push(logs);
        callback(accuracyLoss, trainLogs, false);
      },
    }
  });
  const secPerEpoch = (performance.now() - beginMs) / (1000 * epochs);
  const lastLog = trainLogs.slice(-1)[0];
  let accuracyLoss = '';
  if (lastLog) {
    accuracyLoss = `Train accuracy/loss: ${lastLog.acc.toFixed(4)}/${lastLog.loss.toFixed(4)}; Test accuracy/loss: ${lastLog.val_acc.toFixed(4)}/${lastLog.val_loss.toFixed(4)}`;
  }
  const message = `Model training complete:  ${secPerEpoch.toFixed(4)} seconds per epoch`;
  callback(message, trainLogs, true);
  return model;
}
