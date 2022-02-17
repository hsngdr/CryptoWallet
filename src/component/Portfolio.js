import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import db, { auth } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { AiOutlineDelete } from "react-icons/ai";

function Portfolio({ user }) {
  const [coin, setCoin] = useState("bitcoin");
  const [process, setProcess] = useState("buy");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [coinlist, setCoinlist] = useState([]);
  const [authlist, setAuthlist] = useState([]);
  const [drop, setDrop] = useState([]);
  let final = [];
  let sonuc = [];
  const [last, setLast] = useState([]);

  const [lossprofit, setLossprofit] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const coincollection = collection(db, "coins");

  const addcoin = async (event) => {
    event.preventDefault();
    if (process === "buy") {
      await addDoc(coincollection, {
        coin: coin,
        price: price * 1,
        quantity: quantity * 1,
        cost: price * quantity,
        owner: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
      });
    } else {
      await addDoc(coincollection, {
        coin: coin,
        price: price * 1,
        quantity: quantity * -1,
        cost: price * quantity * -1,
        owner: {
          name: auth.currentUser.displayName,
          id: auth.currentUser.uid,
        },
      });
    }
    window.location.reload();
  };

  useEffect(() => {
    filtercoin();
  }, [coinlist]);

  useEffect(() => {
    uniqueCoin();
  }, [authlist]);

  useEffect(() => {
    filt();
  }, [final]);

  useEffect(() => {
    control();
  }, [sonuc]);

  useEffect(() => {
    totalStats();
  }, [last]);

  const getdoc = async () => {
    const coins = await getDocs(coincollection);
    setCoinlist(coins.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  useEffect(() => {
    getdoc();
    axios
      .get(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
      )
      .then((res) => {
        setDrop(res.data);
      });
  }, []);

  const filtercoin = () => {
    coinlist.map((c) => {
      if (c.owner.id === user.uid) {
        setAuthlist((oldArray) => [...oldArray, c]);
      }
    });
  };

  const uniqueCoin = () => {
    authlist.map((item) => {
      if (final.indexOf(item.coin) === -1) {
        final.push(item.coin);
      }
    });
  };

  const filt = () => {
    final.map((item) => {
      sonuc.push(authlist.filter(({ coin }) => coin === item));
    });
  };
  const control = () => {
    sonuc.map((i) => {
      if (i.length > 1) {
        let totalQuantity = 0;
        let totalCost = 0;
        i.map((a) => {
          totalQuantity = totalQuantity + a.quantity;
          totalCost = totalCost + a.cost;
        });
        setLast((oldArray) => [
          ...oldArray,
          {
            coin: i[0].coin,
            cost: totalCost,
            quantity: totalQuantity,
            price: totalCost / totalQuantity,
          },
        ]);
      } else {
        setLast((oldArray) => [...oldArray, i[0]]);
      }
    });
  };

  const totalStats = () => {
    last.map((item) => {
      drop.map((x) => {
        if (x.id === item.coin) {
          setLossprofit(
            (prevState) =>
              prevState +
              parseFloat(
                parseFloat(
                  parseFloat(item.cost) *
                    ((parseFloat(x.current_price) - parseFloat(item.price)) /
                      parseFloat(item.price))
                ).toFixed(2)
              )
          );
        }
        if (x.id === item.coin) {
          setTotalCost((prevState) => prevState + item.cost);
        }
      });
    });
  };

  const deletecoin = async (coin) => {
    const q = query(collection(db, "coins"), where("coin", "==", coin));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deletedocument(doc.id);
    });
  };

  const deletedocument = async (docu) => {
    const coindoc = doc(db, "coins", docu);
    await deleteDoc(coindoc);
    window.location.reload();
  };

  return (
    <>
      <h1 className="ptitle">Portfolio</h1>
      <div className="port-top">
        <form onSubmit={addcoin}>
          <label className="porttitle">Buy or Sell</label>
          <select
            value={process}
            className="port-input"
            onChange={(e) => setProcess(e.target.value)}
          >
            <option key={uuidv4()}>buy</option>
            <option key={uuidv4()}>sell</option>
          </select>
          <label className="porttitle">Select Coin</label>
          <select
            value={coin}
            className="port-input"
            onChange={(e) => setCoin(e.target.value)}
          >
            {drop.map((c) => {
              return <option key={uuidv4()}>{c.id}</option>;
            })}
          </select>
          <label className="porttitle">Price Per Coin</label>
          <input
            className="port-input"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price Per Coin"
            type="number"
            required
          ></input>
          <label className="porttitle">Quantity</label>
          <input
            className="port-input"
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            type="number"
            required
          ></input>
          <button className="port-input port-submit" type="submit">
            Submit
          </button>
        </form>
      </div>
      <div className="port-body">
        <table>
          <thead>
            <tr>
              <th>Coin</th>
              <th>Average Price</th>
              <th>Quantity</th>
              <th>Cost</th>
              <th>Current Price</th>
              <th>Profit/Loss Percentage</th>
              <th>Profit/Loss </th>
              <th></th>
            </tr>
          </thead>
          {last.map((c) => {
            return (
              <tbody key={uuidv4()}>
                <tr key={uuidv4()}>
                  <td>{c.coin}</td>
                  <td>
                    {parseFloat(
                      parseFloat(c.price).toFixed(2)
                    ).toLocaleString()}{" "}
                    $
                  </td>
                  <td>{parseFloat(c.quantity).toLocaleString()}</td>
                  <td>{c.cost.toLocaleString()} $</td>
                  {drop.map((b) => {
                    if (b.id === c.coin) {
                      if (parseFloat(b.current_price) > parseFloat(c.price)) {
                        return (
                          <>
                            <td key={uuidv4()} className="currentG">
                              {b.current_price} $
                            </td>
                            <td key={uuidv4()} className="currentG">
                              {(
                                ((parseFloat(b.current_price) -
                                  parseFloat(c.price)) /
                                  parseFloat(c.price)) *
                                100
                              ).toFixed(2)}
                              %
                            </td>
                            <td key={uuidv4()} className="currentG">
                              {parseFloat(
                                parseFloat(
                                  parseFloat(c.cost) *
                                    ((parseFloat(b.current_price) -
                                      parseFloat(c.price)) /
                                      parseFloat(c.price))
                                ).toFixed(2)
                              ).toLocaleString()}
                              $
                            </td>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <td key={uuidv4()} className="currentR">
                              {b.current_price} $
                            </td>
                            <td key={uuidv4()} className="currentR">
                              {(
                                ((parseFloat(b.current_price) -
                                  parseFloat(c.price)) /
                                  parseFloat(c.price)) *
                                100
                              ).toFixed(2)}
                              %
                            </td>
                            <td key={uuidv4()} className="currentR">
                              {parseFloat(
                                parseFloat(
                                  parseFloat(c.cost) *
                                    ((parseFloat(b.current_price) -
                                      parseFloat(c.price)) /
                                      parseFloat(c.price))
                                ).toFixed(2)
                              ).toLocaleString()}
                              $
                            </td>
                          </>
                        );
                      }
                    }
                  })}
                  <td
                    key={uuidv4()}
                    onClick={() => {
                      deletecoin(c.coin);
                    }}
                    className="delete"
                  >
                    <AiOutlineDelete />
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
      <h1 className="ptitle"> Total Stats</h1>
      <div className="port-footer">
        <table>
          <thead>
            <tr>
              <th>Total Investment</th>
              <th>Total Profit/Loss Percentage</th>
              <th>Total Profit/Loss </th>
            </tr>
          </thead>
          <tbody>
            {totalCost > 0 ? (
              <>
                <td key={uuidv4()}>{totalCost.toLocaleString()} $</td>
                <td key={uuidv4()}>
                  {parseFloat(
                    ((lossprofit / totalCost) * 100).toFixed(2)
                  ).toLocaleString()}
                  %
                </td>
                <td key={uuidv4()}>{lossprofit.toLocaleString()} $</td>
              </>
            ) : (
              <>
                <td key={uuidv4()}>0 $</td>
                <td key={uuidv4()}>0 %</td>
                <td key={uuidv4()}>0 $</td>
              </>
            )}
            <tr></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Portfolio;
