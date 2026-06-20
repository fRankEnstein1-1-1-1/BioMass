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

   vegetationPixels: {
    type: Number,
    default: 0
},

canopyArea: {
    type: Number,
    default: 0
},

canopyPercentage: {
    type: Number,
    default: 0
},

meanHeight: {
    type: Number,
    default: 0
},

maxHeight: {
    type: Number,
    default: 0
},

processingProgress: {
    type: Number,
    default: 0
},

biomassEstimate: {
    type: Number
},

treeCount: {
    type: Number,
    default: 0
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