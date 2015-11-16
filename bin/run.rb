#! /home/petienne/.rvm/rubies/ruby-2.2.1/bin/ruby -
require 'pry'
require 'pry-byebug'
load 'tsv.rb'
load 'record.rb'
load 'legend.rb'

def execute
  tsv = TSV.new("../tsv/dknox.tsv")
  legend = Legend.new(tsv)
  tsv.populate_ordinates!(legend)
  File.open("../tsv/rendered.tsv", "w") do |f|
    file = ""
    tsv.column_labels.each do |l|
      file += "#{l}\t"
    end
    file = "#{file.chop}\n"
    tsv.records.each do |r|
      file +=
        r.poeta + "\t" +
        r.fabula + "\t" +
        r.fpid + "\t" +
        r.line_number_first_ordinate.to_s + "\t" +
        r.line_number_first_label.to_s + "\t" +
        r.line_number_last_ordinate.to_s + "\t" +
        r.line_number_last_label.to_s + "\t" +
        r.numlines + "\t" +
        r.char_numlines + "\t" +
        r.nomen + "\t" +
        r.genus_personae + "\t" +
        r.line_first + "\t" +
        r.line_last + "\t" +
        r.z_old_text + "\t" +
        r.meter_before + "\t" +
        r.meter_after + "\t" +
        r.closure + "\t" +
        r.comments_on_length + "\t" +
        r.comments_other + "\t" +
        r.meter + "\t" +
        r.metertype + "\n"
    end
    f.puts file
  end

end

execute
