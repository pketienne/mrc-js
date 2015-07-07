class Record
  attr_accessor :poeta, :fabula, :fpid, :line_number_first_ordinate, :line_number_first_label,
                :line_number_last_ordinate, :line_number_last_label, :numlines, :char_numlines, :nomen,
                :genus_personae, :line_first, :line_last, :z_old_text, :meter_before, :meter_after,
                :closure, :comments_on_length, :comments_other, :meter, :metertype

  def initialize(record)
    @poeta = ""
    @fabula = ""
    @fpid = ""
    @line_number_first_ordinate = ""
    @line_number_first_label = ""
    @line_number_last_ordinate = ""
    @line_number_last_label = ""
    @numlines = ""
    @char_numlines = ""
    @nomen = ""
    @genus_personae = ""
    @line_first = ""
    @line_last = ""
    @z_old_text = ""
    @meter_before = ""
    @meter_after = ""
    @closure = ""
    @comments_on_length = ""
    @comments_other = ""
    @meter = ""
    @metertype = ""

    populate(record)
  end

  def populate(record)
    record.gsub!(/[\r\n]/,"\t\n")
    variable_length = record.chomp.split("\t")
    predefined_length = Array.new(19, "")
    variable_length.each_with_index { |value, index|
      predefined_length[index] = value
    }
    predefined_length.each_with_index { | value, index |
      case index
      when 0
        @poeta = value
      when 1
        @fabula = value
      when 2
        @fpid = value
      when 3
        @line_number_first_label = normalize_labels(value)
      when 4
        @line_number_last_label = normalize_labels(value)
      when 5
        @numlines = value
      when 6
        @char_numlines = value
      when 7
        @nomen = value
      when 8
        @genus_personae = value
      when 9
        @line_first = value
      when 10
        @line_last = value
      when 11
        @z_old_text = ""
      when 12
        @meter_before = normalize_meters(value)
      when 13
        @meter_after = normalize_meters(value)
      when 14
        @closure = value
      when 15
        @comments_on_length = value
      when 16
        @comments_other = value
      when 17
        @meter = normalize_meters(value)
      when 18
        @metertype = adjust_blank_metertypes(value)
      end
    }
  end

  def normalize_labels(value)
    numeric, alpha = value.match(/([^0][0123456789]*)(\D*[^\.]*)/i).captures
    case numeric.length
    when 1
      "000#{numeric}#{alpha}"
    when 2
      "00#{numeric}#{alpha}"
    when 3
      "0#{numeric}#{alpha}"
    when 4
      "#{numeric}#{alpha}"
    end
  end

  def normalize_meters(value)
    if /^$/.match(value)
      "[blank]"
    else
      value
    end
  end
  
  def adjust_blank_metertypes(value)
    if value == ""
      @meter
    else
      value
    end            
  end
     
end
