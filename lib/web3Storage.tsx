import { Web3Storage } from "web3.storage";

const __web3storage = new Web3Storage({
	token: process.env.NEXT_PUBLIC_WEB3_STORAGE_APIKEY as string,
});

export default __web3storage;
