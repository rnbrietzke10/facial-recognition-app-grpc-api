const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set('authorization', `Key ${process.env.CLARIFAI_API_KEY}`);

// const clarifai = require('clarifai');
// const app = new Clarifai.App({
//   apiKey: [process.env.CLARIFAI_API_KEY],
// });
const handleApiCall = (req, res) => {
  stub.PostModelOutputs(
    {
      // This is the model ID of a publicly available General model. You may use any other public or custom model ID: aaa03c23b3724a16a56b629203edc62c
      // face-detection id: a403429f2ddf4b49b307e318f00e528b
      model_id: 'a403429f2ddf4b49b307e318f00e528b',
      inputs: [{ data: { image: { url: req.body.input } } }],
    },
    metadata,
    (err, response) => {
      if (err) {
        console.log('Error: ' + err);
        return;
      }

      if (response.status.code !== 10000) {
        console.log(
          'Received failed status: ' +
            response.status.description +
            '\n' +
            response.status.details
        );
        return;
      }

      console.log('Predicted concepts, with confidence values:');
      for (const c of response.outputs[0].data.concepts) {
        console.log(c.name + ': ' + c.value);
      }
      res.json(response);
    }
  );
};

//  Old Clarifai API
// const handleApiCall = (req, res) => {
//   app.models
//     .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
//     .then((data) => res.json(data))
//     .catch((err) => res.status(400).json('Unable to work with API'));
// };

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.status(200).json(entries[0]);
    })
    .catch((err) => res.status(400).json('Unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall,
};
