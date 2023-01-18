const signMessage = async ({ message }) => {
  console.log(message);
  try {
    console.log({ message });
    if (!window.ethereum)
      return "No crypto wallet found. Please install it.";

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    return message + '***' + signature + '***' + address;
  } catch (err) {
    return 'error';
  }
};


if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  // connect popup
  ethereum.enable();
  // signMessage({ message: 'hello' });

  window.ethereum.on("accountsChanged", function () {
    location.reload();
  });

}
