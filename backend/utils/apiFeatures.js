class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    //console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }

  search1() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    //console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Removing some field for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  filter1() {
    const queryCopy = { ...this.queryStr };
    // Removing some fields for category
    // console.log(queryCopy);
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter for Hot Products (Top 10 Price)
    const hotProductsQuery = {
      ...queryCopy,
      price: { $ne: null, $exists: true },
    };
    this.query = this.query.find(hotProductsQuery).sort("-updatedAt").limit(12);

    return this;
  }

  filter2() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    const latestProductsQuery = { ...queryCopy };
    this.query = this.query
      .find(latestProductsQuery)
      .sort("-createdAt")
      .limit(8);
    return this;
  }

  filter3() {
    const queryCopy = { ...this.queryStr };
    // Removing some fields for category
    // console.log(queryCopy);
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);

    //filter for 10 latest products
    const topBestProductsQuery = { ...queryCopy };
    this.query = this.query
      .find(topBestProductsQuery)
      .sort({ ratings: -1 })
      .limit(8);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.skip(skip).limit(resultPerPage);
    return this;
  }
}

module.exports = ApiFeatures;
