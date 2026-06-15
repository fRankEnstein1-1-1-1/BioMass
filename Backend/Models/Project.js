const mongoose = require("mongoose");



const projectSchema = new mongoose.Schema(

    {
       

        projectName: {
            type: String,
            required: true,
            trim: true
        },

     

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

       

        folderPath: {
            type: String
        },
        webodmProjectId: {
            type: String
        },

        webodmTaskId: {
            type: String
        },

   

        status: {
            type: String,

            enum: [
                "uploaded",
                "processing",
                "completed",
                "failed"
            ],

            default: "uploaded"
        },



        orthophotoUrl: {
            type: String
        },

        pointCloudUrl: {
            type: String
        },

                availableAssets: {
    type: [String],
    default: []
},

        dsmPath: {
    type: String
},

dtmPath: {
    type: String
},

chmPath: {
    type: String
},

    processingProgress: {
    type: Number,
    default: 0
},


        biomassEstimate: {
            type: Number
        },

        carbonEstimate: {
            type: Number
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Project", projectSchema);