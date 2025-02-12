import './Deposit.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,
  faHandHoldingDollar,
  faMoneyBillTransfer,
  faPencil,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { createConnectionCompletedEvent, TonConnectButton, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useEffect, useState, useRef } from 'react';
import { beginCell } from '@ton/core';

const TG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" fill="none">
<path d="M28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z" fill="#0098EA"/>
<path d="M37.5603 15.6277H18.4386C14.9228 15.6277 12.6944 19.4202 14.4632 22.4861L26.2644 42.9409C27.0345 44.2765 28.9644 44.2765 29.7345 42.9409L41.5381 22.4861C43.3045 19.4251 41.0761 15.6277 37.5627 15.6277H37.5603ZM26.2548 36.8068L23.6847 31.8327L17.4833 20.7414C17.0742 20.0315 17.5795 19.1218 18.4362 19.1218H26.2524V36.8092L26.2548 36.8068ZM38.5108 20.739L32.3118 31.8351L29.7417 36.8068V19.1194H37.5579C38.4146 19.1194 38.9199 20.0291 38.5108 20.739Z" fill="white"/>
</svg>`;

const updateURLParams = (params) => {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  window.history.pushState(params, '', url);
};

const quickDeposit = [1, 3, 5, 10, 15, 20, 30, 50, 100];

function getTx(uniqId, count) {
    const body = beginCell()
  .storeUint(0, 32)
  .storeStringTail(uniqId)
  .endCell();


  const transaction = {
    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
    messages: [
      {
        address:
          "UQBo00NDg6aAW1ZKdN_dkvamqo4XLiu-ZFypmAcCBYWWRxd0", // message destination in user-friendly format
        amount: `${count * 1000000000}`, // Toncoin in nanotons
        payload: body.toBoc().toString("base64")

      },
    ],
  };

  return transaction;
}



function Deposit() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const inputRef = useRef();
  const wallet = useTonWallet();
  const [isDisabledBtnEditUniq, changeDisabledBtnEditUniq] = useState(true);
  const [uniqId, changeUniqId] = useState(new URLSearchParams(window.location.search).get("uniqId"));
  const [customValue, changeCustomValue] = useState(0.01);
  

  useEffect(() => {
    // console.log(wallet);
  }, [wallet]);


  async function sendTransaction(count) {
    try {
      await tonConnectUI.sendTransaction(getTx(uniqId, count));
    } catch (error) {
      console.error("Full error object:", error);
      if (error.message.includes("User rejection")) {
        console.log("Cancelled tx");
      } else if (error.message.includes("Insufficient balance")) {
        console.log("Insufficient balance");
      } else {
        console.log(`Неизвестная ошибка: ${error.message}`);
      }
    }
  }


  return (
    <div className="Deposit">
      <div className="DepositTitle">Пополнение счета</div>
      <div className="DepositBody">
        <div className="DepositBodyElements">
          <div>

            
            <div className="DepositBodyElementsItem  mb-6">
              <div>
                Подключение
              </div>
              <div className="DepositBodyElementsItemConnect">
                <TonConnectButton />
              </div>
            </div>
            <div className="DepositBodyElementsItem DepositBodyElementsItemSingle">
              <div className='mb-4'>
                Уникальный ключ пользователя
              </div>
              <div className='DepositBodyElementsItemCustom '>
                  <input ref={inputRef}  onChange={(e) => {
                    const value = e.target?.value || "";

                    changeUniqId(value);
                    updateURLParams({ uniqId: value });

                  }} className="DepositBodyElementsItemCustomField" type="text" disabled={isDisabledBtnEditUniq} value={uniqId} />
                  <div className="DepositBodyElementsItemCustomFieldIcon EditIcon" onClick={() => {
                    changeDisabledBtnEditUniq(!isDisabledBtnEditUniq);
                    
                    if (inputRef && inputRef.current && isDisabledBtnEditUniq) {
                      setTimeout(() => {
                        inputRef.current.focus();
                      }, 0);
                    }
                  }}>
                    <FontAwesomeIcon icon={isDisabledBtnEditUniq ? faPencil : faClose} />
                  </div>
              </div>
              <span className='DepositSmallDescription'>*Доступно в настройках пользователя</span>

            </div>
          </div>

          
          {wallet && uniqId ? (<>
              <div className="DepositBodyElementsItem DepositBodyElementsItemSingle">
                <div className='mb-4'>
                  Быстрое пополнение
                </div>
                <div className="DepositBodyElementsItemQuick">
                    {quickDeposit.map((count) => {
                      return (
                        <div key={count} onClick={async () => {
                            const res = await sendTransaction(count);
                          }} className="DepositBodyElementsItemQuickElement">
                          <div>{count}</div>
                          <div className="DepositBodyElementsItemQuickElementIcon" dangerouslySetInnerHTML={{__html: TG_ICON}}></div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="DepositBodyElementsItem DepositBodyElementsItemSingle">
                <div className='mb-4'>
                  Своя сумма
                </div>
                <div className='DepositBodyElementsItemCustom mb-6'>
                    <input min={0.01} step={0.01} value={customValue} onChange={(e) => {
                      changeCustomValue(e.target.value);
                    }} className="DepositBodyElementsItemCustomField" type="number" />
                    <div className="DepositBodyElementsItemCustomFieldIcon" dangerouslySetInnerHTML={{__html: TG_ICON}}></div>
                </div>
                <div className="DepositBtn" onClick={async () => {
                  const res = await sendTransaction(customValue);
                }}>
                  Пополнить
                </div>
              </div>
          </>) : null}
        </div>
      </div>
      <div className="DepositBtns">
        <div className='DepositBtnsItem Active'><FontAwesomeIcon icon={faHandHoldingDollar} /></div>
        <div className='DepositBtnsItem'><FontAwesomeIcon icon={faMoneyBillTransfer} /></div>
        <div className='DepositBtnsItem'><FontAwesomeIcon icon={faFileInvoiceDollar} /></div>
      </div>
    </div>
  );
}

export default Deposit;
