import classes from './BestSeller.module.scss';

function BestSeller() {


    return(
        <div className={classes.container}>
            <span className={classes.text}>Best Seller</span>
            <div className={classes['best-seller']}>
                <div  className={classes.title}>
                <span className={classes.product}>Telecomando</span> 
                <span>Compra ora</span> 
                </div>
                <div className={classes.photo}>foto</div>
            </div>
        </div>
    );
}


export default BestSeller;