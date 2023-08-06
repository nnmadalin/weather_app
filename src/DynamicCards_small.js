import React from 'react';

const DynamicCards_small = ({ day, icon, degrees }) => {
   return (
      <div className="card card_small">
         <div className="row">
            <p className='small_text'>{day}</p>
         </div>
         <div className="row flexing row_img_small">
            <img src={"/icons/" + icon + ".svg"} alt={icon} />
         </div>
         <div className="row">
            <p className='small_text'>{degrees}</p>
         </div>
      </div>
   );
};

export default DynamicCards_small;
