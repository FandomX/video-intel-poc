/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
const localFilePath = './test.mp4'

// Imports the Google Cloud client libraries
const Video = require('@google-cloud/video-intelligence');
const fs = require('fs');

// Instantiates a client
const client = new Video.VideoIntelligenceServiceClient();

// Performs asynchronous video annotation for logo recognition on a file.
async function detectLogo() {
  const inputContent = fs.readFileSync(localFilePath).toString('base64');

  // Build the request with the input content and logo recognition feature.
  const request = {
    inputContent: inputContent,
    features: ['LOGO_RECOGNITION'],
  };

  // Make the asynchronous request
  const [operation] = await client.annotateVideo(request);

  // Wait for the results
  const [response] = await operation.promise();

  // Get the first response, since we sent only one video.
  const annotationResult = response.annotationResults[0];
  for (const logoRecognitionAnnotation of annotationResult.logoRecognitionAnnotations) {
    const entity = logoRecognitionAnnotation.entity;
    // Opaque entity ID. Some IDs may be available in
    // [Google Knowledge Graph Search API](https://developers.google.com/knowledge-graph/).
    console.log(`Entity Id: ${entity.entityId}`);
    console.log(`Description: ${entity.description}`);

    // All logo tracks where the recognized logo appears.
    // Each track corresponds to one logo instance appearing in consecutive frames.
    for (const track of logoRecognitionAnnotation.tracks) {
      console.log(
        `\n\tStart Time Offset: ${track.segment.startTimeOffset.seconds}.${track.segment.startTimeOffset.nanos}`
      );
      console.log(
        `\tEnd Time Offset: ${track.segment.endTimeOffset.seconds}.${track.segment.endTimeOffset.nanos}`
      );
      console.log(`\tConfidence: ${track.confidence}`);

    //   // The object with timestamp and attributes per frame in the track.
    //   for (const timestampedObject of track.timestampedObjects) {
    //     // Normalized Bounding box in a frame, where the object is located.
    //     const normalizedBoundingBox = timestampedObject.normalizedBoundingBox;
    //     console.log(`\n\t\tLeft: ${normalizedBoundingBox.left}`);
    //     console.log(`\t\tTop: ${normalizedBoundingBox.top}`);
    //     console.log(`\t\tRight: ${normalizedBoundingBox.right}`);
    //     console.log(`\t\tBottom: ${normalizedBoundingBox.bottom}`);
    //     // Optional. The attributes of the object in the bounding box.
    //     for (const attribute of timestampedObject.attributes) {
    //       console.log(`\n\t\t\tName: ${attribute.name}`);
    //       console.log(`\t\t\tConfidence: ${attribute.confidence}`);
    //       console.log(`\t\t\tValue: ${attribute.value}`);
    //     }
    //   }

    //   // Optional. Attributes in the track level.
    //   for (const trackAttribute of track.attributes) {
    //     console.log(`\n\t\tName: ${trackAttribute.name}`);
    //     console.log(`\t\tConfidence: ${trackAttribute.confidence}`);
    //     console.log(`\t\tValue: ${trackAttribute.value}`);
    //   }
    // }

    // // All video segments where the recognized logo appears.
    // // There might be multiple instances of the same logo class appearing in one VideoSegment.
    // for (const segment of logoRecognitionAnnotation.segments) {
    //   console.log(
    //     `\n\tStart Time Offset: ${segment.startTimeOffset.seconds}.${segment.startTimeOffset.nanos}`
    //   );
    //   console.log(
    //     `\tEnd Time Offset: ${segment.endTimeOffset.seconds}.${segment.endTimeOffset.nanos}`
    //   );
    }
  }
}

detectLogo();