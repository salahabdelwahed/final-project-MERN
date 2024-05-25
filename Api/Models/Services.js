import mongoose from "mongoose";

const servicesSchema = mongoose.Schema({
  typeSer: {
    type: String,
    require: true
  },
  prix: {
    type: Number,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  image:{ 
    type: String,
    required: true
}
});

const Services = mongoose.model("Services", servicesSchema);
export default Services;
