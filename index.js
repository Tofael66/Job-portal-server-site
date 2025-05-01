
const express = require('express') ;
const cors = require('cors') ;
const app = express() ;
const port = process.env.PORT || 5000 ;


// 2DlThiSrYncTUJN2
// jobPortal

app.use(cors()) ;
app.use(express.json()) ;



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://jobPortal:2DlThiSrYncTUJN2@cluster0.srctjmh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srctjmh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  
    
    const jobCollection = client.db("jobHunter").collection("jobs");
const jobApplicationCollecting = client.db("jobHunter").collection("job_application") 


  // jobs Post 
app.post('/jobs', async (req , res) => {
    const newJob = req.body ;
    const result = await jobCollection.insertOne(newJob) ;
    res.send(result)
      })
  

// all job get
app.get('/jobs' , async (req,res ) => {
  // condition jodi email thake tahale atat kor  na ota kor 
  const email = req.query.email ;
let query = {} ;
  if(email){
    query= {hr_email: email}
  }
const cursar = jobCollection.find(query) ;
const result = await cursar.toArray() ;
res.send(result) ;
})

// just id by get 
app.get('/jobs/:id' , async (req , res) => {
  const id =  req.params.id ;
  const query = {_id: new ObjectId(id)}
  const result = await jobCollection.findOne(query) 
  res.send(result) ;
})


//  joto gulo akta job a koto manush apply korse ta bar korte /job_id dara get 
app.get('/job-application/jobs/:job_id' , async(req , res) => {
  const jobId = req.params.job_id ;
  const query = {job_id : jobId } 
  const result = await jobApplicationCollecting.find(query).toArray() ;
  res.send(result)
})



// query or email by dara matching data get 
app.get("/job-application" , async (req, res ) => {
  const  email = req.query.email ;
  const query = {application_email: email} ;
  const result = await jobApplicationCollecting.find(query).toArray() ;

  // fokirea way to aggregate data 
  for(const application of result){
    console.log(application.job_id)
    const query1 = {_id: new ObjectId(application.job_id)}
    const job = await jobCollection.findOne(query1)
    if(job){
      application.title = job.title  ;
      application.company = job.company ;
      application.company_logo =job.company_logo ;
      application.location=job.location ;
      application.jobType =job.jobType;
    }
  }


  res.send(result)
})


app.patch('/job-application/:id' , async(req, res ) => {
  const id = req.params.id ;
  const data = req.body ;
  const filter = { _id: new ObjectId(id)} ;
  const updatedDoc ={
   $set:{
    status: data.status 
   }
  }
  const result = await jobApplicationCollecting.updateOne(filter , updatedDoc) ;
  res.send(result) ;
})


// job Application api or job post 
app.post("/job-application" , async (req , res) => {
const application = req.body ;
const result =   await jobApplicationCollecting.insertOne(application) ;

// not the best away (use aggregate) 
// skip --
// count apply korse ki na 
const id = application.job_id ;
const quire = { _id: new ObjectId(id)} ;
const job = await jobCollection.findOne(quire) ;
 // console.log(job)

 let newCount = 0 ;
 if(job.applicationCount){
  newCount= job.applicationCount + 1 ;
 }
 else{
  newCount = 1 ;
 }

 // now update the job in info 
 const filter = {_id : new ObjectId(id)} ;
 const updatedDoc = {
  $set:{
    applicationCount: newCount 
  }
 }

 const updateResult = await jobCollection.updateOne(filter , updatedDoc) ; 

res.send(result)
})











  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/' , (req , res) => {
    res.send('job is falling from the sky ')
})

app.listen(port , () => {
    console.log(`Job  is waiting at; ${port}`)
})


