import './Test.css';

const Test = () => {
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
        </div>
    );
}

export default Test;
