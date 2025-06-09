<?php
class FastXor
{
  private string $key;

  public function __construct(string $key)
  {
    if (empty($key)) {
      throw new InvalidArgumentException("Key cannot be empty.");
    }
    $this->key = $key;
  }

  // Converts a string to uppercase hex representation
  public function hexstr(string $s): string
  {
    $r = "";
    for ($i = 0; $i < strlen($s); $i++) {
      $r .= strtoupper(dechex(ord($s[$i])));
    }
    return $r;
  }

  // XOR encrypt the text with the repeating key
  public function encrypt(string $t): string
  {
    $r = '';
    $keyLen = strlen($this->key);
    $textLen = strlen($t);

    for ($i = 0; $i < $textLen; $i++) {
      $r .= $t[$i] ^ $this->key[$i % $keyLen];
    }

    // Return base64 encoded UTF-8 string
    return base64_encode($r);
  }
}
