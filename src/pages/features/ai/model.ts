import * as tf from '@tensorflow/tfjs';

export const PageClass = ['login', 'change_pass', 'signup', 'other'];

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
export const trainModel = async (xTrain: tf.Tensor2D, yTrain: tf.Tensor<tf.Rank>, xTest: tf.Tensor2D, yTest: tf.Tensor<tf.Rank>) => {
  console.log('start training model');
  const epochs = 40;
  const learningRate = 0.01;
  // Define the topology of the model: two dense layers.
  const model = tf.sequential();

  const layer1 = tf.layers.dense({
    units: 10,
    activation: 'sigmoid',
    inputShape: [xTrain.shape[1]]
  });
  model.add(layer1);
  const layer2 = tf.layers.dense({
    units: 3, activation: 'softmax'
  });
  model.add(layer2);
  model.summary();
  
  const optimizer = tf.train.adam(learningRate);
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  
  const trainLogs = [];
  const beginMs = performance.now();
  // Call `model.fit` to train the model.
  const history = await model.fit(xTrain, yTrain, {
    epochs: epochs,
    validationData: [xTest, yTest],
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        // Plot the loss and accuracy values at the end of every training epoch.
        const secPerEpoch =
            (performance.now() - beginMs) / (1000 * (epoch + 1));
        console.log(`Training model... Approximately ${secPerEpoch.toFixed(4)} seconds per epoch`)
        trainLogs.push(logs);
        //calculateAndDrawConfusionMatrix(model, xTest, yTest);
      },
    }
  });
  const secPerEpoch = (performance.now() - beginMs) / (1000 * epochs);
  console.log(`Model training complete:  ${secPerEpoch.toFixed(4)} seconds per epoch`);
  return model;
}
