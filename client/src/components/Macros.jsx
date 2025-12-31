import React from 'react'
import axios from 'axios';

const Macros = () => {
    const [foodItem, setFoodItem] = React.useState("");

    const getMacros = async () => {
    try {
        const response = await axios.get("http://localhost:8080/getFoodMacros", {
        params: { foodItem }
        });
        const nutrients = response.data.nutrients;
        console.log(nutrients)
        console.log("Protein: ",nutrients.find(n => n.nutrientName === "Protein")?.value || "N/A");
        console.log("Carbohydrates: ",nutrients.find(n => n.nutrientName === "Carbohydrate, by difference")?.value || "N/A");
        console.log("Fats: ",nutrients.find(n => n.nutrientName === "Total lipid (fat)")?.value || "N/A");    
        console.log("Fibre: ",nutrients.find(n => n.nutrientName === "Fiber, total dietary")?.value || "N/A");    

    } catch (err) {
            console.error("Error fetching macros:", err.message);
        }
    };
    
  return (
    <>
        <input type="text" placeholder="Enter Food Item" value={foodItem} onChange={(e) => setFoodItem(e.target.value)} />
        <button onClick={getMacros}>Get Macros</button>
        <button>ADD THIS MACROS</button>
    </>
  )
}

export default Macros