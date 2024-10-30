import { useState } from 'react';
import './Test.css';

const Test = () => {

    const arr = []
    let data = {
        resource_id: 'b7cf8f14-64a2-4b33-8d4b-edb286fdbd37', 
        limit: 1500//1273
    };

    async function AB(){
        const res = await fetch(`https://data.gov.il/api/action/datastore_search?resource_id=${data.resource_id}&limit=${data.limit}`)
        .then(response => response.json())
        .then(data => {
            data.result.records.forEach(item => console.log(item['שם_ישוב'].trim()));
        })
        .catch(error => console.error('Error:', error));
    }

    return (
        <div className='test-container'>
            <div className='test-wrapper gold-sponsor'>
                <div className="title-container">GOLD SPONSOR</div>
                <p>GOLD</p>
            </div>

            <div className='sponsor-wrapper'>
                <div className='left-content'>
                    <img src={require('../../assets/bronco.png')} alt="Image 1" />
                    <img src={require('../../assets/bronco.png')} alt="Image 2" />
                    <p>Some additional text or content</p>
                </div>

                <div className='silver-sponsor'>
                    <div className="title-container">SILVER SPONSOR</div>
                    <p>SILVER</p>
                </div>
            </div>

            <div className='test-wrapper bronze-sponsor'>
                <div className="title-container">BRONZE SPONSOR</div>
                <p>BRONZE</p>
            </div>

            <button onClick={AB}>press</button>
        </div>
    );
}

export default Test;
