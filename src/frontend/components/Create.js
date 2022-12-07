import {useState} from 'react';
import {ethers} from 'ethers';
import {Row, Form, Button} from 'react-bootstrap';
import {create as ipfsHttpClient} from 'ipfs-http-client';
import {Buffer} from 'buffer';

const projectId = '2INR4RAY1TMGEjEGlHxOM1xwsKK';
const projectSecret = 'b03142e6048c810971d11aca623a653b';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
        authorization : auth,
    },
});

const Create = ({marketplace, nft}) => {
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const uploadToIPFS = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                const result = await client.add(file);
                console.log(result);
                setImage(
                    `https://nftcolombia.infura-ipfs.io/ipfs/${result.path}`
                );
            } catch (error) {
                console.log('ipfs image upload error: ', error);
            }
        }
    };
    const createNFT = async () => {
        if (!image || !price || !name || !description) return;
        try {
            const result = await client.add(
                JSON.stringify({image, price, name, description})
            );
            mintThenList(result);
        } catch (error) {
            console.log('ipfs uri uload error: ', error);
        }
    };
    const mintThenList = async (result) => {
        const uri = `https://nftcolombia.infura-ipfs.io/ipfs/${result.path}`;
        await (await nft.mint(uri)).wait();
        const id = await nft.tokenCount();
        await await nft.setApprovalForAll(marketplace.address, true);
        const listingPrice = ethers.utils.parseEther(price.toString());
        await (
            await marketplace.makeItem(nft.address, id, listingPrice)
        ).wait();
    };

    return (
        <div className="container-fluid mt-5">
            <div className="row">
                <main
                    role="main"
                    className="col-lg-12 mx-auto"
                    style={{maxWidth: '1000px'}}
                >
                    <div className="content mx-auto">
                        <Row className="g-4">
                            <Form.Control
                                type="file"
                                required
                                name="file"
                                onChange={uploadToIPFS}
                            />
                            <Form.Control
                                onChange={(e) => setName(e.target.value)}
                                size="lg"
                                required
                                type="text"
                                placeholder="Name"
                            />
                            <Form.Control
                                onChange={(e) => setDescription(e.target.value)}
                                size="lg"
                                required
                                as="textarea"
                                placeholder="Descripcion"
                            />
                            <Form.Control
                                onChange={(e) => setPrice(e.target.value)}
                                size="lg"
                                required
                                type="number"
                                placeholder="Precio (ETH)"
                            />
                            <div className="g-grid px-0">
                                <Button
                                    onClick={createNFT}
                                    variant="dark"
                                    size="lg"
                                >
                                    Crear y listar NFT!
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Create;
