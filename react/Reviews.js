import React, { Component } from "react";
import queryRatingSummary from "./graphql/queries/queryRatingSummary.gql";
import { withApollo } from "react-apollo";
import { useRuntime } from "vtex.render-runtime";
import { Spinner, IconSuccess, Pagination, Collapsible, Dropdown, Button  } from 'vtex.styleguide';

let hasUpdated = false;

class Reviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: [],
      average: 0,
      histogram: [],
      count: 0,
      percentage: [],
      selected: "Newest",
      paging: {},
      detailsIsOpen: false,
      alreadyReviews: false
    };
  }

  componentDidMount() {

    //console.log("componentDidMount", this.props.productQuery.loading);

    // if(!this.props.productQuery.loading) {
    //   this.getReviews("Newest");
    // }
  }

  componentDidUpdate() {
    if(!hasUpdated) {
      console.log("componentDidUpdate", this.props.productQuery.loading);

      if(!this.props.productQuery.loading) {
        this.getReviews("Newest");
        hasUpdated = true;
      }

    }
  }

  getReviews = (orderBy, page) => {

    console.log("PROPS", this.props);

    this.props.client.query({
      query: queryRatingSummary,
      variables: { sort: orderBy, page: page || 0, pageId: JSON.stringify({
        linkText: this.props.productQuery.product.linkText,
        productId: this.props.productQuery.product.productId,
        productReference: this.props.productQuery.product.productReference
      }), filter: 0 }
    }).then(response => {
      console.log("RESPONSE: ", response)
      let reviews = response.data.productReviews.results[0].reviews; // revisar se sempre vem 1 item nesse array
      let rollup = response.data.productReviews.results[0].rollup;
      let paging = response.data.productReviews.paging;

      this.setState({
        reviews: reviews,
        average: (rollup != null) ? rollup.average_rating : 0,
        histogram: (rollup != null) ? rollup.rating_histogram : [],
        count: (rollup != null) ? rollup.review_count : 0,
        paging: paging,
        alreadyReviews: reviews.length ? true : false
      });
      //this.calculatePercentage();
    }).catch(error => {
      console.log("ERROR: ", error)
    })
  }

  render() {
    return (this.state.alreadyReviews) ? (
      <div className="review__rating mw8 center ph5">
      <div className="review__rating--stars dib relative v-mid mr2">
        <div className="review__rating--inactive nowrap">
          {[0, 1, 2, 3, 4].map((_, i) => {
            return (i <= 3)? (
              <svg className="mr2" key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={"#eee"} viewBox="0 0 14.737 14"><path d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z" transform="translate(0)"/></svg> // se o review.metrics.rating for 4, preenche 4 estrelas
            ) : ( <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={"#eee"} viewBox="0 0 14.737 14"><path d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z" transform="translate(0)"/></svg> // se o review.metrics.rating for 4, preenche 4 estrelas
            )
          })}
        </div>
        <div className="review__rating--active nowrap overflow-hidden absolute top-0-s left-0-s" style={{width: (this.state.average * 20) + "%"}}>
          {[0, 1, 2, 3, 4].map((_, i) => {
            let { average } = this.state;

            return (i <= 3) ? (
              <svg className="mr2" key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={average > i ? "#fc0" : "#eee"} viewBox="0 0 14.737 14"><path d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z" transform="translate(0)"/></svg> // se o review.metrics.rating for 4, preenche 4 estrelas
            ) : ( <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={average > i ? "#fc0" : "#eee"} viewBox="0 0 14.737 14"><path d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z" transform="translate(0)"/></svg> // se o review.metrics.rating for 4, preenche 4 estrelas
            )
          })}
        </div>
      </div>
      <span className="review__rating--average dib v-mid">
        {this.state.average.toFixed(1)}
      </span>
    </div>
    ) : (
        <div className="review__rating mw8 center ph5">
          <div className="review__rating--stars dib relative v-mid mr2">
            <div className="review__rating--inactive nowrap">
              {[0, 1, 2, 3, 4].map((_, i) => {
                  return <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#eee" viewBox="0 0 14.737 14"><path d="M7.369,11.251,11.923,14,10.714,8.82l4.023-3.485-5.3-.449L7.369,0,5.3,4.885,0,5.335,4.023,8.82,2.815,14Z" transform="translate(0)"></path></svg>
              })}
            </div>
          </div>
          <span className="review__rating--average dib v-mid">
            0
          </span>
        </div>
        
        )
  }
}

export default withApollo(Reviews);