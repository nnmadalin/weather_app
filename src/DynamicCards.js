import React from 'react';

const DynamicCards = ({ day, icon, degrees }) => {
   return (
      <div className="card">
         <div className="row">
            <p>{day}</p>
         </div>
         <div className="row flexing">
            <img src={"/icons/" + icon + ".svg"} alt={icon} />
         </div>
         <div className="row">
            <p>{degrees}</p>
         </div>
      </div>
   );
};

export default DynamicCards;
