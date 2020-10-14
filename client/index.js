import CollabClient from '@pdftron/collab-client';
import WebViewer from '@pdftron/webviewer';

const nameList = [
  'Andy',
  'Andrew',
  'Logan',
  'Justin',
  'Matt',
  'Sardor',
  'Zhijie',
  'James',
  'Kristian',
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'David',
  'Joseph',
  'Thomas',
  'Naman',
  'Nancy',
  'Sandra',
];
const url = `http://localhost:3000`;
const subscriptionUrl = `ws://localhost:3000/subscribe`;
const viewerElement = document.getElementById('viewer');
const currentUser = nameList[Math.floor(Math.random() * nameList.length)];

const client = new CollabClient({
  url,
  subscriptionUrl,
});

WebViewer(
  {
    path: '/public/webviewer', // path to the PDFTron 'lib' folder
    // initialDoc:
    //   'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
  },
  viewerElement
).then(instance => {
  // Instance is ready here
  client.setInstance(instance);
  client.loginAnonymously(currentUser).then(() => {
    // Load document

    client.loadDocument(
      'https://pdftron.s3.amazonaws.com/downloads/pl/demo-annotated.pdf',
      {
        documentId: '1',
        filename: 'demo-annotated.pdf',
      }
    );
    instance.openElements(['leftPanel']);
    const annotManager = instance.docViewer.getAnnotationManager();
    // Assign a random name to client
    annotManager.setCurrentUser(
      nameList[Math.floor(Math.random() * nameList.length)]
    );
  });

  // let { hash = '' } = window.location;
  // hash = hash.replace('#', '');

  // instance.loadDocument(fileURL);
  // instance.docViewer.on('documentLoaded', () => {
  //   client.setSession(hash);
  // })
});
