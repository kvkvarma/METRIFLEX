import React from 'react'
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Macros = () => {
    const [foodItem, setFoodItem] = React.useState("");
    const [macros, setMacros] = React.useState({protein:0, carbs:0, fats:0, fibre:0, calories:0});
    const {user} = useAuth();

    const getMacros = async () => {
    try {
        const response = await axios.get("http://localhost:8080/macros/getFoodMacros", {
        params: { foodItem }
        });
        const nutrients = response.data.nutrients;
        setMacros({
            protein:parseInt(nutrients.find(n=> n.nutrientName === "Protein")?.value || 0),
            carbs:parseInt(nutrients.find(n=> n.nutrientName === "Carbohydrate, by difference")?.value || 0),
            fats:parseInt(nutrients.find(n=> n.nutrientName === "Total lipid (fat)")?.value || 0),
            fibre:parseInt(nutrients.find(n=> n.nutrientName === "Fiber, total dietary")?.value || 0),
            calories:parseInt(nutrients.find(n=> n.nutrientName === "Energy")?.value || 0),
        });
        console.log("Fetched macros:", nutrients);
    } catch (err) {
            console.error("Error fetching macros:", err.message);
        }
    };
    
    const addMacros = async()=>{
      try{
        console.log(user.uid);
        const response = await axios.post("http://localhost:8080/macros/addFoodMacros", {macros,userId:user.uid});
        console.log("Macros added successfully:", response.data);
      }
      catch(err){
        console.error("Error adding macros:", err.message);
      }
    }

  return (
    <>
        <input type="text" placeholder="Enter Food Item" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} />
        <button onClick={getMacros}>Get Macros</button>
        <button onClick={addMacros}>ADD THIS MACROS</button>
    </>
  )
}

export default Macros