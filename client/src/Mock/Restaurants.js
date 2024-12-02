export function searchSuccess1(json) {
    console.log(json);
    const restaurants =  [
        {
            id: 1,
            name: 'Clinton Street Baking Company',
            rating: '4.5',
            img: 'https://s3-media0.fl.yelpcdn.com/bphoto/t6PSIWQ683i6CW5KdaXwJQ/o.jpg',
            review_count: 6000,
            price: '$$',
            coordinates: {longitude: -73.9838, latitude: 40.7213},
            is_open_now: true,
            business_hour: '6pm',
            url: 'https://www.yelp.com/biz/clinton-street-baking-company-new-york-5'
        },
        {
                    id: 2,
                    name: 'Tim Ho Wan',
                    rating: '3.5',
                    img: 'https://s3-media0.fl.yelpcdn.com/bphoto/CHFKBpewP6L8Ku4fVuuk3w/o.jpg',
                    review_count: 1900,
                    price: '$$',
                    coordinates: {longitude: -73.93,latitude: 40.73},
                    is_open_now: false,
                    business_hour: '8am Mon',
                    url: 'https://www.yelp.com/biz/tim-ho-wan-east-village-new-york?osq=tim+ho+wan'
        }
    ];

    return {status: 'success', restaurants: restaurants, total: 2,
         center: {
             longitude: -73.99429321289062,
             latitude: 40.70544486444615
         }
         }
}

export function searchSuccess2(json) {
    console.log(json);
    const restaurants =  [
        {
            id: 1,
            name: 'Clinton Street Baking Company',
            rating: '4.5',
            img: 'https://s3-media0.fl.yelpcdn.com/bphoto/t6PSIWQ683i6CW5KdaXwJQ/o.jpg',
            review_count: 6000,
            price: '$$',
            coordinates: {longitude: -73.9838,latitude: 40.7213},
            is_open_now: true,
            business_hour: '6pm',
            url: 'https://www.yelp.com/biz/clinton-street-baking-company-new-york-5'
        },
        {
                    id: 2,
                    name: 'Tim Ho Wan',
                    rating: '3.5',
                    img: 'https://s3-media0.fl.yelpcdn.com/bphoto/CHFKBpewP6L8Ku4fVuuk3w/o.jpg',
                    review_count: 1900,
                    price: '$$',
                    coordinates: {longitude: -73.93,latitude: 40.73},
                    is_open_now: false,
                    business_hour: '8am Mon',
                    url: 'https://www.yelp.com/biz/tim-ho-wan-east-village-new-york?osq=tim+ho+wan'
        },
        {
            id: 3,
            name: 'cafe',
            rating: '3',
            img: 'https://s3-media0.fl.yelpcdn.com/bphoto/CHFKBpewP6L8Ku4fVuuk3w/o.jpg',
            review_count: 100,
            price: '$',
            coordinates: {longitude: -72.93,latitude: 40.73},
            is_open_now: true,
            business_hour: '8am Mon',
        }
    ];

    return {status: 'success', restaurants: restaurants, total: 2,
         center: {
             longitude: -73.99429321289062,
             latitude: 40.70544486444615
         }
         }
}
