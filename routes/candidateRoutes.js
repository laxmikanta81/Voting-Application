const express = require('express');
const router = express.Router();
const User = require('./../models/candidate');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');
const Candidate = require('./../models/candidate');

const checkAdminRole=async(userId)=>{
    try{
        const user=await User.findById(userId);
        return user.role ==='admin';
    }catch(err){
         return false;
    }
}
// POST route to add a person
router.post('/', async (req, res) =>{
    try{
        if(! await checkAdminRole(req.user.Id)){
            return res.status(403).json({message:'user has no admin role.'})
        }
        const data = req.body // Assuming the request body contains the person data

        // Create a new user document using the Mongoose model
        const newCandidate = new Candidate(data);

        // Save the new user to the database
        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json({response: response});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

router.put('/candidateID', async (req, res)=>{
    try{
        if(! await checkAdminRole(req.user.Id)){
            return res.status(403).json({message:'user has no admin role.'})
        }
        const candidateId = req.params.id; // Extract the id from the URL parameter
        const updatedCandidateData = req.body; // Updated data for the person

        const response = await Person.findByIdAndUpdate(candidateId, updatedCandidateData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        })

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('Candidate data updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})
router.delete('/candidateID', async (req, res)=>{
    try{
        if(! await checkAdminRole(req.user.Id)){
            return res.status(403).json({message:'user has no admin role.'})
        }
        const candidateId = req.params.id; // Extract the id from the URL parameter

        const response = await Person.findByIdAndDelete(candidateId);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('Candidate deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})
router.post('/vote/:candidateId',jwtAuthMiddleware,async (req,res)=>{
   const  candidateId=req.params.candidateId;
   const  userId=req.user.id;
    try{
        const candidate=await Candidate.findById(candidate);
        if(!candidate)
            return res.status(404).json({message:'candidate not found'});
            const user = await User.findById(userId);
            if(!user)
                return res.status(400).json({message:'user not found.'});
            if(user.isVoted){
                res.status(400).json({message:'you have already voted'});
            }
            if(user.role =='admin'){
                res.status(403).json({message:'admin not allowed'});
            }
            
            candidate.votes.push({user:userId});
            candidate.voteCoount++;
            await candidate.save();

            //update user document
            user.isVoted=true;
            await user.save;

    }catch(error){
         console.log(err);
        res.status(500).json({error: 'Internal Server Error'});

    }
});




module.exports = router;