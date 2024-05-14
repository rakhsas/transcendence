import './error.css';


export const FourHundredFourError = () => {
    return (
      <section className='Error'>
          <div id="error-page">
           <div className="content">
              <h2 className="header" data-text="404">
                 404
              </h2>
              <h4 data-text="Opps! Page not found">
                 Opps! Page not found
              </h4>
              <p style={{fontWeight: 'bold'}}>
                 Sorry, the page you're looking for doesn't exist. If you think something is broken, report a problem.
              </p>
              <div className="btns">
                 {/* <a href="http://localhost:3000/">return home</a> */}
              </div>
           </div>
        </div>
      </section>
    )
  }
  