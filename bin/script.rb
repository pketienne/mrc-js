#! /home/petienne/.rvm/rubies/ruby-2.2.1/bin/ruby -w
require 'pry'
require 'pry-byebug'

class TSV
  attr_accessor :uri, :records

  def initialize(uri)
    @uri = uri
    @records = []

    File.open(@uri).each do | record |
      @records.push(Record.new(record))
    end

    @records.shift
  end

  def list
    @records.each do | record |
      puts record.inspect
    end
  end

  def size
    @records.size
  end
  
  def line_number_first_labels
    @records.map { |r| r.line_number_first_label }
  end

  def line_number_last_labels
    @records.map { |r| r.line_number_last_label }
  end
  
end

class Record
  attr_accessor :poeta, :fabula, :fpid, :line_number_first_ordinate, :line_number_first_label,
                :line_number_last_ordinate, :line_number_last_label, :numlines, :nomen,
                :genus_personae, :line_first, :line_last, :meter_before, :meter_after, :closure,
                :comments_on_length, :comments_other, :meter, :metertype

  def initialize(record)
    @poeta = ""
    @fabula = ""
    @fpid = ""
    @line_number_first_ordinate = ""
    @line_number_first_label = ""
    @line_number_last_ordinate = ""
    @line_number_last_label = ""
    @numlines = ""
    @nomen = ""
    @genus_personae = ""
    @line_first = ""
    @line_last = ""
    @meter_before = ""
    @meter_after = ""
    @closure = ""
    @comments_on_length = ""
    @comments_other = ""
    @meter = ""
    @metertype = ""
    populate(record.chomp)
  end

  def populate(record)
    fields = record.split("\t")
    fields.each_with_index { | val, index |
      case index
      when 0
        @poeta = val
      when 1
        @fabula = val
      when 2
        @fpid = val
      when 3
        @line_number_first_ordinate = val
      when 4
        @line_number_first_label = val
      when 5
        @line_number_last_ordinate = val
      when 6
        @line_number_last_label = val
      when 7
        @numlines = val
      when 8
        @nomen = val
      when 9
        @genus_personae = val
      when 10
        @line_first = val
      when 11
        @line_last = val
      when 12
        @meter_before = val
      when 13
        @meter_after = val
      when 14
        @closure = val
      when 15
        @comments_on_length = val
      when 16
        @comments_other = val
      when 17
        @meter = val
      when 18
        @metertype = val
      end
    }
  end
  
end

class OrdinateMap
  attr_accessor :legend
                # :set_a, :set_b, :set_a_uniq, :set_b_uniq, :sets_a_b,
                # :sets_a_uniq_b_uniq, :set_uniq, :modifiers
  
  def initialize(set_a, set_b)
    @legend = (set_a + set_b).uniq!
=begin
    # @set_a = set_a
    # @set_b = set_b
    # @set_a_uniq = @set_a.uniq
    # @set_b_uniq = @set_b.uniq
    # @sets_a_b = @set_a + @set_b
    # @sets_a_uniq_b_uniq = @set_a_uniq + @set_b_uniq
    # @set_uniq = @sets_a_uniq_b_uniq.uniq
    # @modifiers = ["a","b","c","d","fr"]
=end
    normalize_labels
    sort_labels
  end

=begin
  def discover_modifiers
    @modifiers = []
    @set_uniq.each do |r|
      if match = r.match(/(\D+)/i)
        @modifiers.push(match.captures[0])
      end
    end
    @modifiers.uniq!
  end
=end

  def normalize_labels
    @legend.map! { |r|
      r.sub!(/^0+/,"")

      if match = r.match(/(\d+)(\D+)/i)
        digit, nondigit = match.captures
      else
        digit = r
        nondigit = ""
      end

      case digit.length
      when 1
        "000" + digit + nondigit
      when 2
        "00" + digit + nondigit
      when 3
        "0" + digit + nondigit
      when 4
        digit + nondigit
      end
    }
  end

  def sort_labels
    @legend.sort!
  end

end

index = TSV.new("../tsv/index.tsv")
ordinate_map = OrdinateMap.new(index.line_number_first_labels, index.line_number_last_labels)
index.records.each do |r|
  if r.line_number_first_label.include?("2019fr") || r.line_number_last_label.include?("2019fr")
    binding.pry
  end
  r.line_number_first_label = r.line_number_first_label.sub!("2019fr.","2019fr")
  r.line_number_last_label = r.line_number_last_label.sub!("2019fr.","2019fr")
  r.line_number_first_label = r.line_number_first_label.sub!(/^0+/,"")
  r.line_number_last_label = r.line_number_last_label.sub!(/^0+/,"")
  r.line_number_first_ordinate = ordinate_map.legend.index(r.line_number_first_label)
  r.line_number_last_ordinate = ordinate_map.legend.index(r.line_number_last_label)
  if r.line_number_first_label.include?("2019fr") || r.line_number_last_label.include?("2019fr")
    puts "First: #{r.line_number_first_label}, Last: #{r.line_number_last_label}."
  end
end
