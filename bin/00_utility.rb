#! /home/petienne/.rvm/rubies/ruby-2.2.1/bin/ruby -w
require 'pry'
require 'pry-byebug'

=begin
require "csv"
parsed_files = CSV.read("../tsv/index.tsv", { :col_sep => "\t" });
puts parsed_files;

File.open("../tsv/index.tsv").each do | row |
  row.split("\t").each do | column |
    column.chomp!
    puts column
  end
end

records = []
File.open("../tsv/index.tsv").each do | record |
  records.push(record)
end

fields = []
records.each do | field |
  fields.push field
end

records = []
binding.pry
File.open("../tsv/index.tsv").each do | record |
  records.push(record.chomp!)
end
binding.pry
=end

var records = {}

def main()
  # go

File.open("../tsv/index.tsv").each do | record |
  records.push(parse_record)
end

class Record
  attr_accessor :poeta, :fabula, :fpid, :line_number_first_ordinate, :line_number_first_label,
                :line_number_last_ordinate, :line_number_first_label, :numlines, :nomen, :genus_personae,
                :line_first, :line_last, :meter_before, :meter_after, :closure, :comments_on_length,
                :comments_other, :meter, :metertype
  def initialize(poeta, fabula, fpid, line_number_first_ordinate, line_number_first_label,
                 line_number_last_ordinate, line_number_last_label, numlines, nomen, genus_personae,
                 line_first, line_last, meter_before, meter_after, closure, comments_on_length,
                 comments_other, meter, metertype)
    @poeta = poeta
    @fabula = fabula
    @fpid = fpid
    @line_number_first_ordinate = line_number_first_ordinate
    @line_number_first_label = line_number_first_label
    @line_number_last_ordinate = line_number_last_ordinate
    @line_number_last_label = line_number_last_label
    @numlines = numlines
    @nomen = nomen
    @genus_personae = genus_personae
    @line_first = line_first
    @line_last = line_last
    @meter_before = meter_before
    @closure = closure
    @comments_on_length = comments_on_length
    @comments_other = comments_other
    @meter = meter
    @metertype = metertype
  end
end

def main
  var records = []
  File.open("../tsv/index.tsv").each do | record |
    records.push(Record.new(record.chomp!)
  end
end

def parse_record(record)
  var object = {}
  record.split("\t").echo do | field |
  end
end

