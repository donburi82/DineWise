import express from "express";
import yelp from "yelp-fusion";


// move these variables to a static file later
const PORT = 5050;
const API_KEY = "drUhONvSXTyLqnZh-AjHNZRKtNV_Zt2ilUUYBEqPyzYUTYbUjw70fgcnlUZLIv59HTrlYXcMYa9_CjhFLohuWIuMFL6y8pd39B_doNjgNFyv9s2U6bxidd2TGbofZ3Yx"
const app = express();
const client = yelp.client(API_KEY);

app.use(express.json());

// JSON form, post to address/search
// location
// term (cannot be empty)
// categories (should come from supported categories)
// price (integers from 1 to 4)
// open_now
// open_at

app.post("/search", (req, res) => {
    if (req.body.term === undefined) {
        res.send({
            status: "FAIL",
            body: "search term unspecified"
        })
        return;
    }

    const location = req.body.location? req.body.location : 'New York';
    const term = req.body.term;

    const searchRequest = {
      term: term,
      location: location
    };

    console.log(searchRequest);
     client.search(searchRequest).then(response => {
          //restrict results to 5 for now
          const businesses = response.jsonBody.businesses;
          const totalB= response.jsonBody.total;
          const region = response.jsonBody.region;

          const results = {
            status: "SUCCESS",
            businesses: businesses,
            total: totalB,
            region: region
          }
          res.send(results);
        }).catch(e => {
        console.log(e);
          res.send({
              status: "FAIL",
              body: "Yelp API error"
          });
        });
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});