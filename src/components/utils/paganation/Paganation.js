import './Paganation.css';

const Paganation = ({handleNextPage, handlePrevPage, page, adList, afterThis, TOTAL_PAGES}) => {

    return (
        <div className="pagination">
            <button onClick={handleNextPage} disabled={page === TOTAL_PAGES || adList.length === 0 || !afterThis}>
                הבא
            </button>
            <span>דף {page}</span>
            <button onClick={handlePrevPage} disabled={page === 1}>קודם</button>
        </div>
    );
};

export default Paganation;