import {users} from '../dummyData/data.js'
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'

const userResolver = {
  Mutation: {
    signUp: async(_,{input}, context) => {
      try{
        const {username, name, password, gender} = input
        if(!username || !name || !password || !gender) {
          throw new Error("All fields are required");
        }
        const existingUser = await User.findOne({username});
        if(existingUser) {
          throw new Error("User alreday exists");
        }
    //genSalt turns encrypted/hashed passoword into 10char length
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //get random profile pic based on geneder 
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

      const newUser = new User({
        username,
        name,
        password: hashedPassword,
        gender,
        profilePicture: gender === "male" ? boyProfilePic : girlProfilePic,
      })
      await newUser.save();
      await context.login(newUser);
      return newUser;

      }catch(err){
        console.error("Error in sign up", err);
        throw new Error(err.message || "Internal server error");

      }
    },

    login: async(_,{input}, context) => {
      try{
        const {username, password} = input;
        if (!username || !password) throw new Error("Please fill in all fields");
        const {user} =  await context.authenticate("graphql-local", {username, password}) 

        await context.login(user);
        return user;

      }catch(err){
        console.error("Error in login", err);
        throw new Error(err.message || "Internal server error");

      }
    },
    logout: async(_, args, context) => {
      try{
        await context.logout();
        context.req.session.destroy((err) => {
          if(err)throw err;
        })
       context.res.clearCookie("connect.sid");
       return{ message: "Logged out successfully"};

      }catch(err){
        console.error("Error in logout", err);
        throw new Error(err.message || "Internal server error");
      }
    }

  },

  Query: {
    authUser: async(_,args,context) => {
      try{
        const user = await context.getUser();
        return user;

      }catch(err){
        console.error("Error in authUser", err);
        throw new Error(err.message || "Internal server error");
      }
     
    },
    user: async(_, {userId}) => {
      try{
        const user = await User.findById(userId);
        return user;

      }catch(err){
        console.error("Error in user query", err);
        throw new Error(err.message || "Error getting user");
      }

    }
  }, 

  // TODO => ADD USER/TRANSACTION Relationship 
}

export default userResolver;