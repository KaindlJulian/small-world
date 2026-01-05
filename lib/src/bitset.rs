#[derive(Debug)]
pub struct BitSet {
    data: Vec<u64>, // one word stores 64 bits/monsters
    len: usize,     // number of bits/monsters
}

impl BitSet {
    pub fn new(len: usize) -> Self {
        let number_of_words = len + 64 / 64;
        Self {
            data: vec![0; number_of_words],
            len,
        }
    }

    pub fn set(&mut self, index: usize) {
        let vec_index = index / 64;
        let word_index = index % 64;
        self.data[vec_index] |= 1 << word_index;
    }

    pub fn get(&self, idx: usize) -> bool {
        let vec_index = idx / 64;
        let word_index = idx % 64;
        (self.data[vec_index] >> word_index) & 1 == 1
    }

    pub fn len(&self) -> usize {
        self.len
    }

    /// count number of monsters in set
    pub fn count_ones(&self) -> u32 {
        self.data.iter().fold(0, |acc, &x| acc + x.count_ones())
    }

    /// logical and
    pub fn and(&self, other: &Self) -> Self {
        let mut result = Self::new(self.len);
        for i in 0..self.data.len() {
            result.data[i] = self.data[i] & other.data[i];
        }
        result
    }

    /// logical or
    pub fn or(&self, other: &Self) -> Self {
        let mut result = Self::new(self.len);
        for i in 0..self.data.len() {
            result.data[i] = self.data[i] | other.data[i];
        }
        result
    }

    /// logical not
    pub fn not(&self) -> Self {
        let mut result = Self::new(self.len);

        for i in 0..self.data.len() {
            result.data[i] = !self.data[i];
        }

        let unused_bits = result.data.len() * 64 - result.len;
        if unused_bits > 0 {
            let last = result.data.last_mut().unwrap();
            if unused_bits >= 64 {
                *last = 0;
            } else {
                *last &= u64::MAX >> unused_bits;
            }
        }

        result
    }
}
