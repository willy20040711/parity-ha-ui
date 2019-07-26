const moment = window.moment;

export class AuctionStatus {
  static get objType() {
    return({ "_enum": [ "Ongoing", "Cancelled", "Closed" ] });
  }

  static status(parityStatus) {
    const obj = parityStatus.toJSON();
    if (obj.hasOwnProperty("Ongoing")) return "ongoing";
    if (obj.hasOwnProperty("Cancelled")) return "cancelled";
    if (obj.hasOwnProperty("Closed")) return "closed";
    throw `Unknown AuctionStatus: ${parityStatus}`;
  }
}

export class BidStatus {
  static get objType() {
    return({ "_enum": [ "Active", "Withdrawn" ] });
  }

  static status(parityStatus) {
    const obj = parityStatus.toJSON();
    if (obj.hasOwnProperty("Active")) return "active";
    if (obj.hasOwnProperty("Withdrawn")) return "withdrawn";
    throw `Unknown BidStatus: ${parityStatus}`;
  }
}

export class Kitty {
  static get objType() {
    return({
      "id": "Hash",
      "name": "Option<Vec<u8>>",
      "owner": "Option<AccountId>",
      "owner_pos": "Option<u64>",
      "in_auction": "bool"
    });
  }

  constructor(parityObj) {
    this.id = parityObj.id.toJSON();
    this.name = parityObj.name.toJSON().map(code => String.fromCharCode(code)).join("");
    this.in_auction = parityObj.in_auction.toJSON();
    this.owner = parityObj.owner.toJSON();
    this.owner_pos = parityObj.owner_pos.toJSON();
  }
}

export class AuctionTx {
  static get objType() {
    return({
      "tx_time": "Moment",
      "winner": "AccountId",
      "tx_price": "Balance"
    });
  }

  constructor(parityObj) {
    this.tx_time = moment.unix(parityObj.tx_time.toJSON());
    this.winner = parityObj.winner.toJSON();
    this.tx_price = parityObj.tx_price.toJSON();
  }
}

export class Auction {
  static get objType() {
    return({
      "id": "Hash",
      "kitty_id": "Hash",
      "base_price": "Balance",
      "start_time": "Moment",
      "end_time": "Moment",
      "status": "AuctionStatus",
      "topmost_bids": "Vec<Hash>",
      "price_to_topmost": "Balance",
      "display_bids": "Vec<Hash>",
      "display_bids_last_update": "Moment",
      "tx": "Option<AuctionTx>"
    });
  }

  constructor(parityObj, bidsCountParityObj = null) {
    this.id = parityObj.id.toJSON();
    this.kitty_id = parityObj.kitty_id.toJSON();
    this.base_price = parityObj.base_price.toJSON();
    this.start_time = moment.unix(parityObj.start_time.toJSON());
    this.end_time = moment.unix(parityObj.end_time.toJSON());
    this.status = AuctionStatus.status(parityObj.status);
    this.topmost_bids = parityObj.topmost_bids.toJSON();
    this.price_to_topmost = parityObj.price_to_topmost.toJSON();
    this.display_bids = parityObj.display_bids.toJSON();
    this.display_bids_last_update = moment.unix(parityObj.display_bids_last_update.toJSON());
    this.tx = parityObj.tx.toJSON() && new AuctionTx(parityObj.tx);
    this.bids_count = bidsCountParityObj && bidsCountParityObj.toJSON();
  }
}

export class Bid {
  static get objType() {
    return({
      "id": "Hash",
      "auction_id": "Hash",
      "bidder": "AccountId",
      "price": "Balance",
      "last_update": "Moment",
      "status": "BidStatus"
    });
  }

  constructor(parityObj) {
    this.id = parityObj.id.toJSON();
    this.auction_id = parityObj.auction_id.toJSON();
    this.bidder = parityObj.bidder.toJSON();
    this.price = parityObj.price.toJSON();
    this.last_update = moment.unix(parityObj.last_update.toJSON());
    this.status = new BidStatus(parityObj.status);
  }
}
