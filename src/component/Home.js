import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGetCryptosQuery } from "./CryptoStats";
import News from "./News";

function Home() {
  const [coins, setCoins] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const { data, isFetching } = useGetCryptosQuery();
  const globalStats = data;

  useEffect(() => {
    setInterval(() => {
      axios
        .get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
        )
        .then((res) => {
          setCoins(res.data);
        });
      axios
        .get("https://api.coingecko.com/api/v3/exchanges?per_page=10")
        .then((res) => {
          setExchanges(res.data);
        });
    }, 3000);
  }, []);

  if (isFetching) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="contain">
        <h1 className="title">Crypto currency stats</h1>
        <table>
          <thead>
            <tr>
              <th>Total Market Cap</th>
              <th>Market Cap Change 24h</th>
              <th>Volume 24h</th>
              <th>Total Cryptocurrencies</th>
              <th>Bitcoin Dominance </th>
            </tr>
          </thead>
          <tbody>
            <tr className="stat">
              <td>{globalStats.market_cap_usd.toLocaleString()} $</td>
              <td>{globalStats.market_cap_change_24h.toLocaleString()} %</td>
              <td>{globalStats.volume_24h_usd.toLocaleString()} $</td>
              <td>{globalStats.cryptocurrencies_number.toLocaleString()}</td>
              <td>
                {globalStats.bitcoin_dominance_percentage.toLocaleString()} %
              </td>
            </tr>
          </tbody>
        </table>

        <div className="colomn">
          <div className="grid">
            <h1 className="title">Top 10 crypto currency</h1>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Image</th>
                  <th>Crypto Name</th>
                  <th>Current price</th>
                  <th>Market cap change</th>
                  <th>Market cap </th>
                </tr>
              </thead>
              {coins.map((coin) => {
                return (
                  <tbody key={coin.id}>
                    <tr>
                      <td>{coin.market_cap_rank}</td>
                      <td>
                        <img
                          className="cryptoImage"
                          src={coin.image}
                          alt="crypto image"
                        />
                      </td>
                      <td>
                        {coin.name} ({coin.symbol.toLowerCase()})
                      </td>
                      {coin.price_change_percentage_24h < 0 ? (
                        <td className="red">
                          {coin.current_price.toLocaleString()}$
                        </td>
                      ) : (
                        <td className="green">
                          {coin.current_price.toLocaleString()}$
                        </td>
                      )}
                      {coin.price_change_percentage_24h < 0 ? (
                        <td className="red">
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </td>
                      ) : (
                        <td className="green">
                          {coin.market_cap_change_percentage_24h.toFixed(2)}%
                        </td>
                      )}
                      <td>{coin.market_cap.toLocaleString()}$</td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
          <div className="grid">
            <h1 className="title">Top 10 crypto exchanges</h1>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Trust score</th>
                  <th>Exchange image</th>
                  <th>Exchange name</th>
                  <th>Trade volume 24h (btc) </th>
                </tr>
              </thead>
              {exchanges.map((exchange) => {
                return (
                  <tbody key={exchange.id}>
                    <tr>
                      <td>{exchange.trust_score_rank}</td>
                      <td>{exchange.trust_score}</td>
                      <td>
                        <img
                          className="cryptoImage"
                          src={exchange.image}
                          alt="exchange image"
                        />
                      </td>
                      <td>{exchange.name}</td>
                      <td>
                        {exchange.trade_volume_24h_btc_normalized.toLocaleString()}{" "}
                        (BTC)
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
        <div className="home-news">
        <h1 className="title">News</h1>
          <News quantity />
        </div>
      </div>
    </div>
  );
}
export default Home;
