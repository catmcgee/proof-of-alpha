import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PublicKey,
  Signature,
  PrivateKey,
  Provable,
} from 'snarkyjs';

// The public key of our trusted data provider
const ORACLE_PUBLIC_KEY =
  'B62qpTtGBS5WjpQWzsu6rj8Z7pSvxQaXjABt8AnZg48Z8AsaCnCYTtW';

export class SwapsOracle extends SmartContract {
  // Define contract state
  @state(PublicKey) oraclePublicKey = State<PublicKey>();

  // Define contract events
  events = {
    verified: Provable.Array(Field, 2),
  };

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method init() {
    super.init();
    // Initialize contract state
    this.oraclePublicKey.set(PublicKey.fromBase58(ORACLE_PUBLIC_KEY));
    // Specify that caller should include signature with tx instead of proof
    this.requireSignature();
  }

  @method verify(
    id: Field,
    walletId: Field,
    publicKey: PublicKey,
    signature: Signature
  ) {
    console.log('netering verify method in swapsoracle');
    // Get the oracle public key from the contract state
    const oraclePublicKey = this.oraclePublicKey.get();
    this.oraclePublicKey.assertEquals(oraclePublicKey);
    // Before verifying signature
    console.log('Verifying signature with publicKey:', publicKey);

    // Evaluate whether the signature is valid for the provided data
    const validSignature = signature.verify(publicKey, [id, walletId]);
    console.log('Valid Signature?: ', validSignature);

    Provable.asProver(() => {
      const boolValue = validSignature.toBoolean();
      console.log('Valid Signature2 ?: ', boolValue);
    });
    // Check that the signature is valid
    validSignature.assertTrue();
    console.log('assert thing', validSignature.assertTrue());

    // Emit an event containing the verified transaction id and their wallet address
    this.emitEvent('verified', [id, walletId]);
  }
}
