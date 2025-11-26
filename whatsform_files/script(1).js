function initMicroNavbar() {
  var currentHost = window.location.host;
  var htmlContent = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap');

        .micro-container {
            font-family: "Plus Jakarta Sans", sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
            color: #898989;
            padding: 10px 20px;
            border-bottom: 1px solid #f1f1f1;
            width: 100%;
            position: relative;
            top: 0;
            z-index:999;
        }
    
        @media (max-width: 768px) {
          .micro-container{
            justify-content: flex-start;
            overflow-x: scroll;
          } 
        }
        .micro-text {
            margin-right: 15px;
            display: flex;
            line-height: 1rem;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            -webkit-font-smoothing antialiased;
        }
        .micro-text a{
          width: 32px;
        }
        .micro-icons {
            display: flex;
        }
        .micro-logo {
            margin-left: 20px;
            cursor: pointer;
            width: 120px;
            background-size: 120px;
            filter: grayscale(100%);
            transition: filter 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: #666;
            line-height: 1rem;
            opacity: 0.6;
            transition: all 0.3s ease;
        }
        .micro-lighten img{
            opacity: 0.5;
        }
        .micro-logo img {
            width: 22px;
            height: 22px;
        }
        .micro-logo span {
            font-size: 15px;
            font-weight: 700;
        }
        .micro-logo:hover {
            filter: grayscale(0%);
            opacity: 1;
            color:#000;
        }
        .micro-logo:hover img {
            opacity: 1;
        }
        .micro-m-icon {
            width: 22px;
            cursor: pointer;
            margin: 0px 5px;
            opacity: 0.5;
            transition: all 0.3s ease;
        }
        .micro-m-icon:hover {
            opacity: 1;
        }
    </style>
    <div class="micro-container">
        <div class="micro-text">Discover <a href="https://micro.company/?utm_source=micro_navbar&utm_medium=${encodeURI(
          currentHost
        )}" target="_blank"><img class="micro-m-icon micro-lighten" src="https://micro.company/assets/logos/m.svg" alt="Micro.company"></a> products:</div>
        <div class="micro-icons">
            <a id="cc" class="micro-logo micro-lighten" href="https://collect.chat/?utm_source=micro_navbar&utm_medium=${encodeURI(
              currentHost
            )}" target="_blank">
                <img src="https://micro.company/assets/logos/cc.svg" alt="CollectChat">
                <span>Collect.chat</span>
            </a>
            <a id="wf" class="micro-logo" href="https://whatsform.com/?utm_source=micro_navbar&utm_medium=${encodeURI(
              currentHost
            )}" target="_blank">
                <img src="https://micro.company/assets/logos/wf.svg" alt="WhatsForm">
                <span>WhatsForm</span>
            </a>
            <a id="hc" class="micro-logo" href="https://help.center/?utm_source=micro_navbar&utm_medium=${encodeURI(
              currentHost
            )}" target="_blank">
                <img src="https://micro.company/assets/logos/hc.svg" alt="HelpCenter">
                <span>Help.center</span>
            </a>
            <a id="sl" class="micro-logo" href="https://store.link/?utm_source=micro_navbar&utm_medium=${encodeURI(
              currentHost
            )}" target="_blank">
                <img src="https://micro.company/assets/logos/sl.svg" alt="StoreLink">
                <span>Store.link</span>
            </a>
            <a id="ls" class="micro-logo" href="https://locatestore.com/?utm_source=micro_navbar&utm_medium=${encodeURI(
              currentHost
            )}" target="_blank">
                <img src="https://micro.company/assets/logos/ls.svg" alt="HelpCenter">
                <span>LocateStore</span>
            </a>
        </div>
    </div>
`;

  document.querySelector('body').insertAdjacentHTML('afterbegin', htmlContent);
  document.getElementById('cc').style.display = currentHost.includes(
    'collect.chat'
  )
    ? 'none'
    : 'flex';
  document.getElementById('wf').style.display = currentHost.includes(
    'whatsform.com'
  )
    ? 'none'
    : 'flex';
  document.getElementById('sl').style.display = currentHost.includes(
    'store.link'
  )
    ? 'none'
    : 'flex';
  document.getElementById('hc').style.display = currentHost.includes(
    'help.center'
  )
    ? 'none'
    : 'flex';
  document.getElementById('ls').style.display = currentHost.includes(
    'locatestore.com'
  )
    ? 'none'
    : 'flex';
}
