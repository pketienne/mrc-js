#! /home/petienne/.rvm/rubies/ruby-2.2.1/bin/ruby -w
require 'pry'
require 'pry-byebug'
load 'tsv.rb'
load 'record.rb'
load 'legend.rb'

def execute
  tsv = TSV.new("../tsv/index.tsv")
  File.open("../tsv/index-updated.tsv", "w") do |f|
    file =
      "poeta" + "\t" +
      "fabula" + "\t" +
      "fpid" + "\t" +
      "line_number_first_ordinate" + "\t" +
      "line_number_first_label" + "\t" +
      "line_number_last_ordinate" + "\t" +
      "line_number_last_label" + "\t" +
      "numlines" + "\t" +
      "nomen" + "\t" +
      "genus_personae" + "\t" +
      "line_first" + "\t" +
      "line_last" + "\t" +
      "meter_before" + "\t" +
      "meter_after" + "\t" +
      "closure" + "\t" +
      "comments_on_length" + "\t" +
      "comments_other" + "\t" +
      "meter" + "\t" +
      "metertype" + "\n"

    tsv.records.each do |r|
      file +=
        r.poeta + "\t" +
        r.fabula + "\t" +
        r.fpid + "\t" +
        r.line_number_first_ordinate + "\t" +
        r.line_number_first_label + "\t" +
        r.line_number_last_ordinate + "\t" +
        r.line_number_last_label + "\t" +
        r.numlines + "\t" +
        r.nomen + "\t" +
        r.genus_personae + "\t" +
        r.line_first + "\t" +
        r.line_last + "\t" +
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
