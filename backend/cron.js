//Cron jobs are scheduled tasks that run periodically at fixed intervals or specific times
//We send 1 get for every 14 min so Render free plan remains active
import cron from 'cron';
import https from 'https';

const URL = "https://graphql-expense-tracker-dnei.onrender.com";

const job = new cron.CronJob('*14 * * * * ', function(){
  https.get(URL, (res) => {
    if(res.status === 200) {
      console.log("Get request sent successfully")
    } else {
      console.log("GET request failed", res.statusCode)
    }
   
  }).on('error', (e)=> {
    console.error("Error while sending request", e);
  })
})

export default job;