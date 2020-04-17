import {
  generateMnemonic,
  mnemonic2seed,
  seed2keyPair,
  validMnemonic,
  validAddress,
  validImplicitAddress,
  validContractAddress,
  validOperationHash,
  validBase58string,
  sign,
} from './utils';

describe('#generateMnemonic', () => {
  it('should return mnemonics', () => {
    const mnemonic = generateMnemonic(24);
    expect(mnemonic).toBeDefined();
    expect(mnemonic.split(' ').length).toEqual(24);
  });
  it('should throw error', () => {
    try {
      generateMnemonic(17);
      throw new Error("Didn't throw error");
    } catch (e) {
      expect(e.message).toEqual('InvalidNumberOfWords');
    }
  });
});
const mnemonicRef =
  'stock swear gentle disagree cram february urge owner inhale matter bullet umbrella barely north carry';
const seedRef = Buffer.from([
  46,
  74,
  15,
  9,
  11,
  239,
  71,
  151,
  9,
  222,
  68,
  156,
  131,
  71,
  7,
  39,
  234,
  214,
  110,
  183,
  246,
  53,
  41,
  209,
  178,
  109,
  89,
  203,
  177,
  223,
  107,
  45,
]);
const keyPairRef = {
  sk:
    'edskRi52FeJ5GmcNbj48resg3P1xTSnSnDLQ7sGJkq6C6vH4aa1qqXwJfAvhYkFfhPqYvtqtekqyFQcPjATKpiz1FNJujd6VT9',
  pk: 'edpkuUd462CS9WMJ9J5Y4pepCL9UmB6QEtWPSREcbQd7oVggTt599m',
  pkh: 'tz1SCQXce8LwS6qK77ExAAUKY1HYd5EhJHC7',
};

describe('#mnemonic2seed', () => {
  it('should return seed', () => {
    const seed = mnemonic2seed(mnemonicRef);
    expect(seed).toBeDefined();
    expect(seed).toEqual(seedRef);
  });
  it('should return another seed', () => {
    const seed = mnemonic2seed(mnemonicRef, 'test');
    expect(seed).toBeDefined();
    expect(seed).not.toEqual(seedRef);
  });
  it('should throw error', () => {
    try {
      mnemonic2seed(mnemonicRef.slice(7));
      throw new Error("Didn't throw error");
    } catch (e) {
      expect(e.message).toEqual('InvalidMnemonic');
    }
  });
});

describe('#seed2keyPair', () => {
  it('should return keyPair', async () => {
    const keyPair = await seed2keyPair(seedRef);
    expect(keyPair).toBeDefined();
    expect(keyPair).toEqual(keyPairRef);
  });
});

describe('#validMnemonic', () => {
  it('should return true', async () => {
    const ans = validMnemonic(mnemonicRef);
    expect(ans).toBeDefined();
    expect(ans).toBeTruthy();
  });
  it('should return false', async () => {
    const ans = validMnemonic(mnemonicRef.slice(1));
    expect(ans).toBeDefined();
    expect(ans).toBeFalsy();
  });
  it('should return false', async () => {
    const ans = validMnemonic('');
    expect(ans).toBeDefined();
    expect(ans).toBeFalsy();
  });
});

describe('#validOperationHash', () => {
  it('should return true', async () => {
    const ans = validOperationHash(
      'oojCsV42BnPocd9hUctiC7fNa6r5EGABxJnF6bVow1ByCSX4z4E'
    );
    expect(ans).toBeDefined();
    expect(ans).toBeTruthy();
  });
  it('should return false', async () => {
    const ans = validOperationHash('o');
    expect(ans).toBeDefined();
    expect(ans).toBeFalsy();
  });
  it('should return false', async () => {
    const ans = validOperationHash(
      'oojCsV42BnPocd9hUctiC7fNa6r5EGABxJnF6bVow1ByCSX4zE4'
    );
    expect(ans).toBeDefined();
    expect(ans).toBeFalsy();
  });
});

describe('#validAddress', () => {
  const cases = [
    ['tz1NhJPtvaewKoRAzZWwMxydApkeDEVP1qyu', true],
    ['KT1XFsS2yxrgDzRHZYctJXzjXP9QLvffX8sD', true],
    ['tz3adcvQaKXTCg12zbninqo3q8ptKKtDFTLv', true],
    ['tz1NhJPtvaewKoRAzZWwMxydApkeDEVP1qyx', false],
    ['opTNfDh4H4ksbfnG6eVwZX7F4C9TtzAo1fDWpcp4yZ5EKeV2FsH', false],
  ];
  test.each(cases)(
    'given %p as address, returns %p',
    (address: string, expectedResult: boolean) => {
      expect(validAddress(address)).toEqual(expectedResult);
    }
  );
});
describe('#validBase58string', () => {
  let address;

  beforeEach(() => {
    address = 'tz1gjdKcadfkyuR6qJeDVn3VPu8jGSXyLz3U';
  });
  it('correct (tz1) prefix is true', () => {
    expect(validBase58string(address, 'tz1')).toBe(true);
  });
  it('incorrect (tz2) prefix is false', () => {
    expect(validBase58string(address, 'tz2')).toBe(false);
  });
});

describe('#validImplicitAddress', () => {
  it('tz1gjdKcadfkyuR6qJeDVn3VPu8jGSXyLz3U is true', () => {
    expect(validImplicitAddress('tz1gjdKcadfkyuR6qJeDVn3VPu8jGSXyLz3U')).toBe(
      true
    );
  });
  it('KT1XFsS2yxrgDzRHZYctJXzjXP9QLvffX8sD is false', () => {
    expect(validImplicitAddress('KT1XFsS2yxrgDzRHZYctJXzjXP9QLvffX8sD')).toBe(
      false
    );
  });
});

describe('#validContractAddress', () => {
  it('KT1XFsS2yxrgDzRHZYctJXzjXP9QLvffX8sD is true', () => {
    expect(validContractAddress('KT1XFsS2yxrgDzRHZYctJXzjXP9QLvffX8sD')).toBe(
      true
    );
  });
  it('KT1XFsS2yxrgDzRHZYct is false', () => {
    expect(validContractAddress('KT1XFsS2yxrgDzRHZYct')).toBe(false);
  });
});

const bytes =
  '8c9243dddc8e927cbb9a888804e577ca3a96ac2c00ef2f0380b6cb4b1d9f71996c00e769a0d79a655c31776b8db8309fee94f7e4ebe48b0ae49526af5000c0843d00003b5d4596c032347b72fb51f688c45200d0cb50db00';
const sk =
  'edskRkxXZjCEifMNJKrJfWPuQWbqs81yYJDjQMuDAvNedcuLjj84NPgJP7V2xNgLoWRBpGtfa3bF6uJ38JS8WEhoXrC2etPycK';
const signedRef = {
  bytes:
    '8c9243dddc8e927cbb9a888804e577ca3a96ac2c00ef2f0380b6cb4b1d9f71996c00e769a0d79a655c31776b8db8309fee94f7e4ebe48b0ae49526af5000c0843d00003b5d4596c032347b72fb51f688c45200d0cb50db00',
  sig: new Uint8Array([
    86,
    160,
    130,
    240,
    73,
    168,
    37,
    231,
    187,
    203,
    131,
    134,
    93,
    149,
    211,
    241,
    18,
    99,
    218,
    188,
    51,
    64,
    190,
    219,
    90,
    23,
    182,
    94,
    96,
    150,
    246,
    8,
    74,
    134,
    17,
    137,
    214,
    187,
    132,
    184,
    163,
    119,
    126,
    111,
    83,
    59,
    178,
    109,
    135,
    218,
    201,
    86,
    11,
    226,
    16,
    126,
    1,
    128,
    154,
    188,
    59,
    202,
    115,
    10,
  ]),
  edsig:
    'edsigtj96Kp3inq4acpnbEG18h1J3z8QnWnf5yPfX74Mry1HJjkLHrJCThqAbdd9awge3LiM7DigT56Drbn7iGwyMZnYirD7fL4',
  sbytes:
    '8c9243dddc8e927cbb9a888804e577ca3a96ac2c00ef2f0380b6cb4b1d9f71996c00e769a0d79a655c31776b8db8309fee94f7e4ebe48b0ae49526af5000c0843d00003b5d4596c032347b72fb51f688c45200d0cb50db0056a082f049a825e7bbcb83865d95d3f11263dabc3340bedb5a17b65e6096f6084a861189d6bb84b8a3777e6f533bb26d87dac9560be2107e01809abc3bca730a',
};

describe('#sign', () => {
  it('Should sign', () => {
    const signed = sign(bytes, sk);
    expect(signed).toBeDefined();
    expect(signed.bytes).toBe(signedRef.bytes);
    expect(signed.sig.length).toBe(signedRef.sig.length);
    expect(JSON.stringify(signed)).toBe(JSON.stringify(signedRef));
  });
});
