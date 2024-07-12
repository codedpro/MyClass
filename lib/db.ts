import { MongoClient, ServerApiVersion } from 'mongodb';

const credentials = 'cert.pem';

const uri = 'mongodb+srv://cluster0.cikjihk.mongodb.net/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri, {
  tlsCertificateKeyFile: credentials,
  serverApi: ServerApiVersion.v1
});

let isConnected = false;

async function connectToDatabase() {
  if (!isConnected) {
    await client.connect();
    console.log('Connected to MongoDB');
    isConnected = true;
  }
  return client.db('myclass');
}

export { connectToDatabase };
