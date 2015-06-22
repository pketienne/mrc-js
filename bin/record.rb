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
    populate(record)
  end

  def populate(record)
    fields = record.chomp.split("\t")
    fields.each_with_index { | value, index |
      case index
      when 0
        @poeta = value
      when 1
        @fabula = value
      when 2
        @fpid = value
      when 3
        @line_number_first_label = normalize(value)
      when 4
        @line_number_last_label = normalize(value)
      when 5
        @numlines = value
      when 6
        @nomen = value
      when 7
        @genus_personae = value
      when 8
        @line_first = value
      when 9
        @line_last = value
      when 10
        @meter_before = value
      when 11
        @meter_after = value
      when 12
        @closure = value
      when 13
        @comments_on_length = value
      when 14
        @comments_other = value
      when 15
        @meter = value
      when 16
        @metertype = value
      end
    }
  end

  def normalize(value)
    numeric, alpha = value.match(/([^0][123456789]*)(\D+)/i)
    alpha = "fr" if alpha.match(/fr\.$/i)
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
  
end
