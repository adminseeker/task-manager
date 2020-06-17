const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = new express.Router();

router.post("/users",async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save()
        const token = await user.generateAuthToken();
        res.status(201).send({user,token});
    }catch(e){
        res.status(400).send(e);    
    }
});

router.post("/users/login",async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user,token});
    }catch(e){
        res.status(400).send();
    }
});

router.post("/users/logout",auth,async (req,res)=>{
    
    try{
        req.user[0].tokens = req.user[0].tokens.filter((token)=>{
            return token.token !== req.token;
        });
       const user = req.user[0]; 
       user.tokens=req.user[0].tokens;
        await user.save();
        res.send("Logged out!");
    }catch(e){
        res.status(500).send(e);
    }
});

router.post("/users/logoutAll",auth,async (req,res)=>{
    try{
        req.user[0].tokens = [];
        const user=req.user[0];
        user.tokens=req.user[0].tokens;
        await user.save();
        res.send("Logged out from all devices!");
    }catch(e){
        res.status(500).send(e);
    }
});

router.get("/users/me",auth,async (req,res)=>{
    res.send(req.user);
});

router.patch("/users/me",auth,async (req,res)=>{
    const updates=Object.keys(req.body);
    const allowedUpdates =["name","age","email","password"];
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send("Error: Invalid Updates");
    }
    try{
        const user = req.user[0];
        updates.forEach((update)=>user[update]=req.body[update]);
        await user.save();
        res.send(user);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete("/users/me",auth,async (req,res)=>{
    try{
        const user = req.user[0];
        await user.remove();
        res.send(user);
    }catch(e){
        res.status(500).send();
    }
});

module.exports = router;