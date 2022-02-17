import React from "react";
import { useGetNewsQuery } from "./NewsApi";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

function News({quantity}) {
  const { data: CryptoNews } = useGetNewsQuery({
    newsCategory: "Cryptocurrency",
    count: quantity?6:100
  });

  const demoImage =
    "https://www.analyticsinsight.net/wp-content/uploads/2021/12/5-Best-Tips-to-Boost-Your-Cryptocurrency-Investment-in-2022.jpg";

  if (!CryptoNews?.value) return <div className="loading">Loading...</div>;

  return (
    <div className="news-container">
      {CryptoNews.value.map((news) => (
        <div key={uuidv4()} className="news-card">
          <a
            href={news.url}
            target="_blank"
            rel="noreferrer"
            className="news-a"
          >
            <img
              src={news?.image?.thumbnail?.contentUrl || demoImage}
              alt=""
              className="news-img"
            />
            <div className="news-body">
              <p className="news-title">{news.name}</p>
              <p className="news-desc">
                {news.description.length > 100
                  ? `${news.description.substring(0, 100)}...`
                  : news.description}
              </p>

              <div className="news-author">
                <img
                  src={
                    news.provider[0]?.image?.thumbnail?.contentUrl || demoImage
                  }
                  alt=""
                  className="news-author-img"
                />
                <p className="news-author-name">{news.provider[0]?.name}</p>
              </div>
              <p className="news-time">
                {moment(news.datePublished).startOf("ss").fromNow()}
              </p>
            </div>
          </a>
        </div>
      ))}
    </div>
  );
}

export default News;
