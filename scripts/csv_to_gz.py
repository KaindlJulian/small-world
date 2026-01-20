import os
import gzip
import argparse

parser = argparse.ArgumentParser(description="Compress a CSV file using gzip.")
parser.add_argument("input_file", help="Path to the input CSV file")
parser.add_argument("output_file", help="Path to the output gzip file")
args = parser.parse_args()

input_file = args.input_file
output_file = args.output_file

if not os.path.exists(input_file):
    raise FileNotFoundError(f"{input_file} does not exist")

with open(input_file, 'rb') as f_in:
    with gzip.open(output_file, 'wb') as f_out:
        f_out.write(f_in.read())

print(f"Compressed {input_file} to {output_file}")
