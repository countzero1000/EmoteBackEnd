var port = process.env.PORT || 8080;
let fs = require('fs').promises
let axios = require('axios')
let apiKey = 'baac9f01816d4f33aaea7c852c1cf2d6';
let cogIdentify ='https://tamuhack.cognitiveservices.azure.com/face/v1.0/identify'
let cogDetect = 'https://tamuhack.cognitiveservices.azure.com/face/v1.0/detect'
const multer = require('multer')
const upload = multer({dest:'uploads/'})
const Mongoose = require('mongoose')
const mongoUri = 'mongodb+srv://Admin:iamadmin@cluster0-q8knh.azure.mongodb.net/test?retryWrites=true&w=majority';
let express = require('express')
let app = express();
let ofs = require('fs')
let Notes = require('./models/notes');
let bodyParser = require('body-parser');
var cors = require('cors')
var formidable = require('formidable')

app.use(cors())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}



Mongoose.connect(mongoUri, mongoOptions)
.then(()=>{
    console.log('mongoose is connected')
}).catch((error)=>{
    console.log(error)
})


app.post('/processFrame',(req,res)=>{

        
       var data = [];

        req.on('data',(chunk)=> {
            data.push(chunk)
        }).on('end', async ()=>{

            var buffer = Buffer.concat(data);
            await fs.writeFile('test.jpeg',buffer)
            console.log(buffer)
            axios.post(cogDetect,buffer,{
                headers:{
                    'Content-Type' : 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key' : apiKey,
                },
                params:{
                    returnFaceId: true,
                    returnFaceLandmarks: false,
                    returnFaceAttributes: "emotion" 
                }
            }).then((cogRes)=>{ 
                console.log(cogRes.data[0].faceId);
                res.setHeader('Access-Control-Allow-Origin', '*')
                res.send(cogRes.data[0].faceAttributes.emotion);
            }).catch((error)=>{
                console.log(error.data)
            })

        })

        
})

app.post('/getNotes',(req,res)=>{
    Notes.findOne({mood:req.body.mood})
    .then((note)=>{
        res.send(note);
    })
})


app.post('/saveNotes',(req,res)=>{

    console.log(req);

    Notes.find({mood:req.body.mood})
    .then(async (notes)=>{
        if(notes.length == 0){
            let newNotes = new Notes({
                            
                _id : new Mongoose.Types.ObjectId,
                content:req.body.content,
                mood:req.body.mood

            })
            newNotes.save();
        }else{
           let note = await Notes.findOneAndUpdate(

                {mood:req.body.mood},
                {content: req.body.content},
                {
                 new: true, upsert: true 
                }
            )
            console.log(note.content);
        }
        res.send('done');
    })
})


app.listen(port,(req,res)=>{
    console.log('Running on port ' + port)
})

/*axios.post(cogIdentify,

    {
        "faceIds" : ['b439e3d4-8971-493f-9cc7-c87d63f6c5d8'],
        "maxNumOfCandidatesReturned": 1,
        "confidenceThreshold": 0.5
    },
    {
    headers:{
        'Content-Type' : 'application/json',
        'Ocp-Apim-Subscription-Key' : apiKey,
    }

}).then((res)=>{
    console.log(res.data)
}).catch((error)=>{
    console.log(error.data)
})*/


let groupCreator = 'https://tamuhack.cognitiveservices.azure.com/face/v1.0/persongroups';

/*axios.get(groupCreator, { 
    headers:{
    'Ocp-Apim-Subscription-Key' : apiKey,
    }
}).then((res)=>{
    console.log(res);
})*/



recognizeFace = (faceId) =>{

    let data = {
        largePersonGroupId: "tamugroup",
        faceIds: [
            "c5c24a82-6845-4031-9d5d-978df9175426"
        ],
        maxNumOfCandidatesReturned: 1,
        confidenceThreshold: 0.5
    }

    axios.post(cogIdentify,data,{          
        headers:{
            'Content-Type' : 'application/json',
            'Ocp-Apim-Subscription-Key' : apiKey,
        }
    }).catch((error)=>{
        console.error(error)
    })
}

createPerson = (personId) => {
    let url = 'https://tamuhack.cognitiveservices.azure.com/face/v1.0/persongroups/tamugroup/persons'

    axios.post(url,{
        name:"fakePerson"
    },{
        headers:{
            'Content-Type' : 'application/json',
            'Ocp-Apim-Subscription-Key' : apiKey,
        }
    }).then((data)=>{console.log(data)})

}

addFace = async (personId,face) => {

    fs.readFile(face).then((data)=>{
        let url = 'https://tamuhack.cognitiveservices.azure.com/face/v1.0/persongroups/tamugroup/persons/5c541771-6b29-4925-a52a-740ac7ba8f0a/persistedFaces'
        //console.log(data)
        axios({
            headers:{
                'Content-Type' : 'application/application/octet-stream',
                'Ocp-Apim-Subscription-Key' : apiKey,
            },
            body :{ data },
            method: "post",
            url : url
    }).then((res)=>{
        console.log(res)
    }).catch((error)=>{
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        });
    })
}



//recognizeFace('c7489b53-c44a-416c-936d-48543365ce90');

//createPerson('anyone');

//addFace('fakePerson', 'happy.jpeg');