import React, { useState, useEffect } from "react";
import axios from "axios";

const Exchanges = () => {
  const [exchanges, setExchanges] = useState([]);

  useEffect(() => {
    axios.get("https://api.coingecko.com/api/v3/exchanges").then((res) => {
      setExchanges(res.data);
    });
  }, []);

  return (
    <div>
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
  );
};

export default Exchanges;
